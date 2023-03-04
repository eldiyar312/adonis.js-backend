import Database from '@ioc:Adonis/Lucid/Database'
import { string } from '@ioc:Adonis/Core/Helpers'
import Excel from 'exceljs'
import moment from 'moment'

import {
  RECEIPT_EXPORT_COLUMNS,
  CUSTOM_PROPERTIES_COLUMN_DESCRIPTION,
  POSITION_LIST_COLUMN_DESCRIPTION,
  TAX_RATES,
  PAYMENT_TYPES,
  RECEIPT_STATUSES,
  RECEIPT_OPERATIONS,
  TAX_SYSTEMS,
  Message,
  FiscalizationStatus,
} from '../../../../constants'
import { isNumber, joinPhones, round } from '../../../../helpers/functions'
import User from 'App/Models/User'
import logger, { createLogMessage } from '../../../../libs/logger'
import Receipt from 'App/Models/Receipt'

const paymentType = (variable = true) => {
  return `
    CASE 
      WHEN content ISNULL THEN 'Безналичными'
      WHEN
      (SELECT COUNT(*) FROM jsonb_array_elements(content->'checkClose'->'payments')) = (SELECT COUNT(*) FROM jsonb_array_elements(content->'checkClose'->'payments') AS payments WHERE payments->>'type' = '0')
      THEN 'Наличными'
      WHEN
      (SELECT COUNT(*) FROM jsonb_array_elements(content->'checkClose'->'payments')) = (SELECT COUNT(*) FROM jsonb_array_elements(content->'checkClose'->'payments') AS payments WHERE payments->>'type' = '1')
      THEN 'Безналичными'
      WHEN
      (SELECT COUNT(*) FROM jsonb_array_elements(content->'checkClose'->'payments')) = (SELECT COUNT(*) FROM jsonb_array_elements(content->'checkClose'->'payments') AS payments WHERE payments->>'type' = '13')
      THEN 'Аванс'
      WHEN
      (SELECT COUNT(*) FROM jsonb_array_elements(content->'checkClose'->'payments')) = (SELECT COUNT(*) FROM jsonb_array_elements(content->'checkClose'->'payments') AS payments WHERE payments->>'type' = '14')
      THEN 'Кредит'
      WHEN
      (SELECT COUNT(*) FROM jsonb_array_elements(content->'checkClose'->'payments')) = (SELECT COUNT(*) FROM jsonb_array_elements(content->'checkClose'->'payments') AS payments WHERE payments->>'type' = '15')
      THEN 'БСО'
      ELSE 'Комбинированный'
    END ${variable ? 'AS payment_type' : ''}
  `
}

export const getReceipts = async ({ response, request, auth }) => {
  try {
    const { page, pageSize, sortedBy, sortedDesc, filtered } = request.qs()

    let options = 'ORDER BY updated_at DESC'
    let filter = ''

    if (sortedBy)
      options = `ORDER BY ${string.snakeCase(sortedBy)} ${sortedDesc === 'true' ? 'DESC' : 'ASC'}`

    if (filtered) {
      for (const key in filtered) {
        const value = filtered[key]
        switch (key) {
          case 'automats':
            filter += ` AND (${value
              .map((val, i) => (i ? 'OR ' : '') + 'r.automat_id = ' + val)
              .join(' ')})`
            break
          case 'devices':
            filter += ` AND (${value
              .map((val, i) => (i ? 'OR ' : '') + 'r.device_id = ' + val)
              .join(' ')})`
            break
          case 'payment_type':
            filter += ` AND ${paymentType(false)} = '${value}'`
            break
          case 'product_name':
            filter += ` AND LOWER(content->'positions'->0->>'text') LIKE LOWER('%${value}%')`
            break
          case 'company_name':
            filter += ` AND LOWER(r.company_name) LIKE LOWER('%${value}%')`
            break
          case 'document_index':
            filter += ` AND LOWER(r.document_index) LIKE LOWER('%${value}%')`
            break
          case 'begin_amount':
            filter += ` AND amount >= ${value}`
            break
          case 'end_amount':
            filter += ` AND amount <= ${value}`
            break
          case 'begin_date':
            filter += ` AND processed_at >= timestamp '${value}'`
            break
          case 'end_date':
            filter += ` AND processed_at <= timestamp '${value}'`
            break
          default:
            filter += ` AND r.${string.snakeCase(key)} = '${value}'`
            break
        }
      }
    }

    const {
      rows: [{ count }],
    } = await Database.rawQuery(
      `SELECT COUNT(r.id)::INTEGER
      FROM receipts r
        LEFT JOIN automats a on r.automat_id = a.id
        LEFT JOIN devices d on r.device_id = d.id
      WHERE r.account_id = :accountId ${filter}`,
      {
        accountId: auth.user.accountId,
      }
    )

    const { rows } = await Database.rawQuery(
      `SELECT 
        r.*, a.name as automat_name, d.device_name,
        content->'positions'->0->>'text' as product_name,
        ${paymentType()}
      FROM receipts r
        LEFT JOIN automats a on r.automat_id = a.id
        LEFT JOIN devices d on r.device_id = d.id
      WHERE r.account_id = :accountId ${filter}
      GROUP BY r.id, a.name, d.device_name
      ${options}
      LIMIT :limit
      OFFSET :offset`,
      {
        accountId: auth.user.accountId,
        offset: count < +pageSize ? 0 : +page * +pageSize,
        limit: +pageSize,
      }
    )

    response.send({ result: { page: +page, pageSize: +pageSize, rows, count } })
    logger.info(`Receipts got`, createLogMessage({ request, response }))
  } catch (error) {
    response.send({ error: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getReceipt = async ({ response, request, auth }) => {
  try {
    const { id } = request.params()

    const { rows: receipts } = await Database.rawQuery(
      `SELECT r.*, a.name as automat_name, d.device_name,
      ${paymentType()}
      FROM receipts r
        LEFT JOIN automats a on a.id = r.automat_id
        LEFT JOIN devices d on d.id = r.device_id
      WHERE r.id = :id AND r.account_id = :accountId
      GROUP BY r.id, a.name, d.device_name`,
      { id, accountId: auth.user.accountId }
    )

    response.send({ result: receipts })
    logger.info(`Receipt got`, createLogMessage({ request, response }))
  } catch (error) {
    response.send({ error: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const resendReceiptToFiscalization = async ({ response, request }) => {
  try {
    const { id } = request.params()

    const receipt = await Receipt.updateOrCreate(
      { id },
      { fiscalizationStatus: FiscalizationStatus.RESEND_TO_FISCALIZATION }
    )

    response.send({ result: receipt })
    logger.info(`Resend receipt to fiscalization`, createLogMessage({ request, response }))
  } catch (error) {
    response.send({ error: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

const receiptHandler = (receipt) => {
  const {
    id,
    companyName,
    calculationAddress,
    deviceSN,
    automat,
    content,
    companyINN,
    deviceRN,
    fsNumber,
    shiftNumber,
    documentNumber,
    documentIndex,
    fp,
    processedAt,
    amount,
    fiscalizationStatus,
  } = receipt

  const getTaxRate = (value) =>
    TAX_RATES(moment(processedAt)).find((tax) => value === Number(tax.value))

  const ndsAmounts = content.positions.reduce((result, position) => {
    const rate = getTaxRate(position.tax)
    const sum =
      result[rate?.label || ''] || 0 + (rate?.rate || 0) * +position.price * +position.quantity
    return Object.assign(result, { [rate?.label || '']: isNumber(sum) ? sum.toFixed(2) : '' })
  }, {})

  const positions = content.positions
    .reduce((result, position) => {
      const {
        text,
        quantity,
        priceBrutto,
        price,
        tax,
        paymentMethodType,
        paymentSubjectType,
        nomenclatureString,
        nomenclatureCode,
        agentType,
        supplierInfo = {},
        supplierINN,
        agentInfo = {},
        manufacturerCountryCode,
        customsDeclarationNumber,
        additionalAttribute,
        excise,
      } = position

      const exportPosition = [
        text || '',
        quantity || '',
        priceBrutto ? Number(priceBrutto).toFixed(2) : '',
        price ? Number(price).toFixed(2) : '',
        tax || '',
        paymentMethodType || '',
        paymentSubjectType || '',
        nomenclatureString ? `|${nomenclatureString}|` : '',
        nomenclatureCode ? `|${nomenclatureCode}|` : '',
        supplierInfo.name || '',
        joinPhones(supplierInfo.phoneNumbers),
        supplierINN || '',
        agentType || '',
        agentInfo.paymentAgentOperation || '',
        agentInfo.paymentOperatorName || '',
        agentInfo.paymentOperatorAddress || '',
        agentInfo.paymentOperatorINN || '',
        joinPhones(agentInfo.paymentTransferOperatorPhoneNumbers),
        joinPhones(agentInfo.paymentAgentPhoneNumbers),
        joinPhones(agentInfo.paymentOperatorPhoneNumbers),
        additionalAttribute || '',
        manufacturerCountryCode || '',
        customsDeclarationNumber || '',
        excise || '',
      ]

      result.push(`[${exportPosition.join(', ')}]`)
      return result
    }, [])
    .join(', ')

  const paymentTypes = content.checkClose.payments
    .map(({ type }) => PAYMENT_TYPES[type])
    .filter((value, typeIndex, self) => self.indexOf(value) === typeIndex)
    .join(', ')

  const values = {
    id,
    fiscalizationStatus: RECEIPT_STATUSES.find(({ value }) => value === Number(fiscalizationStatus))
      ?.label,
    companyName,
    calculationAddress,
    deviceSN,
    automat: automat?.name || '',
    processedAtDate: moment(processedAt).format('DD.MM.YY'),
    processedAtTime: moment(processedAt).format('HH:mm'),
    operation: RECEIPT_OPERATIONS.find(({ value }) => value === content.type)?.label,
    companyINN,
    deviceRN,
    fsNumber,
    shiftNumber,
    documentNumber,
    amount: round(Number(amount)),
    paymentTypes,
    taxValues: Object.keys(ndsAmounts).join(', '),
    taxAmounts: Object.values(ndsAmounts).join(', '),
    taxationSystem:
      TAX_SYSTEMS.find(({ value }) => value === content.checkClose.taxationSystem)?.label || '',
    documentIndex,
    fp,
    positions,
    ffdFields: [
      content.agentType || '',
      joinPhones(content.paymentTransferOperatorPhoneNumbers),
      joinPhones(content.paymentAgentPhoneNumbers),
      joinPhones(content.paymentOperatorPhoneNumbers),
      joinPhones(content.supplierPhoneNumbers),
      content.paymentOperatorName || '',
      content.paymentOperatorAddress || '',
      content.paymentOperatorINN || '',
      content.additionalAttribute || '',
      content.paymentAgentOperation || '',
      content.additionalUserAttribute?.name || '',
      content.additionalUserAttribute?.value || '',
    ].join(', '),
  }

  return values
}

export const exportReceipts = async ({ request, response }) => {
  try {
    const {
      formValues: { type, format },
      sortedBy,
      sortedDesc,
      token,
    } = request.qs()

    const user = await User.findBy('remember_me_token', token)

    if (!user) return response.badRequest({ message: Message.ACCESS_DENIED })

    let options = ''

    if (sortedBy) {
      switch (sortedBy) {
        case 'payment_type':
          options = `ORDER BY payment_type ${sortedDesc === 'true' ? 'DESC' : 'ASC'}`
          break
        case 'automat_name':
          options = `ORDER BY a.name ${sortedDesc === 'true' ? 'DESC' : 'ASC'}`
          break
        case 'device_name':
          options = `ORDER BY d.device_name ${sortedDesc === 'true' ? 'DESC' : 'ASC'}`
          break
        case 'product_name':
          options = `ORDER BY product_name ${sortedDesc === 'true' ? 'DESC' : 'ASC'}`
          break
        default:
          options = `ORDER BY r.${sortedBy} ${sortedDesc === 'true' ? 'DESC' : 'ASC'}`
          break
      }
    }

    const { rows: receipts } = await Database.rawQuery(
      `SELECT r.*,
      ${paymentType()}
      FROM receipts r
        LEFT JOIN automats a on r.automat_id = a.id
        LEFT JOIN devices d on r.device_id = d.id
      WHERE r.account_id = :accountId
      GROUP BY r.id, a.name, d.device_name
      ${options}`,
      { accountId: user.accountId }
    )

    const workbook = new Excel.Workbook()
    const receiptsWorksheet = workbook.addWorksheet('Список чеков')

    receiptsWorksheet.columns = RECEIPT_EXPORT_COLUMNS(type) as Partial<Excel.Column>[]
    const headerRow = receiptsWorksheet.getRow(1)
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    headerRow.font = { size: 14, bold: true }

    if (format === 'xlsx' && type !== 'simple') {
      receiptsWorksheet.getCell('N1').value = {
        richText: [
          { text: 'Список позиций' },
          { font: { size: 8 }, text: ` \n${POSITION_LIST_COLUMN_DESCRIPTION}` },
        ],
      }
    }

    if (format === 'xlsx' && type === 'full') {
      receiptsWorksheet.getCell('V1').value = {
        richText: [
          { text: 'Доп. параметры чека' },
          { font: { size: 8 }, text: ` \n${CUSTOM_PROPERTIES_COLUMN_DESCRIPTION}` },
        ],
      }
    }

    receiptsWorksheet.addRows(receipts.map((receipt) => receiptHandler(receipt)))

    let receiptsFile: Excel.Buffer

    if (format === 'csv') {
      receiptsFile = await workbook.csv.writeBuffer({
        sheetName: 'Список чеков',
      })
    } else {
      receiptsFile = await workbook.xlsx.writeBuffer()
    }

    response.attachment(`Экспорт чеков от ${moment().format('DD-MM-YYYY')}.${format}`)
    response.send(receiptsFile, 'binary')
    logger.info(
      `Экспорт чеков от ${moment().format('DD-MM-YYYY')}.${format}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}
