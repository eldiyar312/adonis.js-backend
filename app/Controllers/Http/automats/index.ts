import Database from '@ioc:Adonis/Lucid/Database'
import Automat from 'App/Models/Automat'
import AutomatGroup from 'App/Models/AutomatGroup'
import AutomatMark from 'App/Models/AutomatMark'
import AutomatModel from 'App/Models/AutomatModel'
import AutomatProduct from 'App/Models/AutomatProduct'
import AutomatSetting from 'App/Models/AutomatSetting'
import AutomatSettingFiscalization from 'App/Models/AutomatSettingFiscalization'
import AutomatSettingModeExeMaster from 'App/Models/AutomatSettingModeExeMaster'
import AutomatSettingModeMdb from 'App/Models/AutomatSettingModeMdb'
import AutomatSettingModeMdbExe from 'App/Models/AutomatSettingModeMdbExe'
import AutomatSettingModePose from 'App/Models/AutomatSettingModePose'
import AutomatSettingModePulse from 'App/Models/AutomatSettingModePulse'
import AutomatSettingSchedule from 'App/Models/AutomatSettingSchedule'
import {
  AutomatValidator,
  CreateAutomatSettingValidator,
  DeleteAutomatValidator,
  MoveAutomatsValidator,
} from 'App/Validators/AutomatValidator'
import logger, { createLogMessage } from '../../../../libs/logger'
import { Message, RouteStatuses } from '../../../../constants'
import {
  DAutomatSetting,
  DFiscalization,
  DModeMdb,
  DModeMdbExe,
  DModeExeMaster,
  DModePose,
  DModePulse,
  DSchedule,
  DAutomatGroup,
} from '../../../../constants/default'
import { string } from '@ioc:Adonis/Core/Helpers'
import { strToBool } from '../../../../helpers/functions'

export const createAutomat = async ({ auth, request, response }) => {
  try {
    await request.validate(CreateAutomatSettingValidator)

    const {
      setting,
      automat,
      createChildren,
      schedule,
      fiscalization,
      modePose,
      modePulse,
      modeMdb,
      modeMdbExe,
      modeExeMaster,
    } = request.body()

    if (!automat?.name.trim()) return response.badRequest({ message: Message.NOT_CORRECT_NAME })

    if (!automat?.modelId) automat.modelId = 38
    if (!automat?.groupId) {
      let [automatGroupExists] = await AutomatGroup.query()
        .where('name', DAutomatGroup.name)
        .andWhere('accountId', auth.user.accountId)
      if (!automatGroupExists)
        automatGroupExists = await AutomatGroup.create({
          ...DAutomatGroup,
          accountId: auth.user.accountId,
        })
      automat['groupId'] = automatGroupExists.id
    }

    const automatNameExist = await Automat.query()
      .where('name', automat.name)
      .andWhere('accountId', auth.user.accountId)
      .first()
    if (automatNameExist) return response.badRequest({ message: Message.AUTOMAT_NAME_EXISTS })

    automat['accountId'] = auth.user.accountId

    let { rows: number } = await Database.rawQuery(
      'select number from automats where account_id = ? order by id desc limit 1',
      [auth.user.accountId]
    )
    number = number.length ? +number[0].number + 1 : 1

    const automatCreated = await Automat.create({
      ...((Object.keys(automat || {}).length && automat) || {}),
      number,
    })

    const automatFiscalization = await AutomatSettingFiscalization.create(
      (Object.keys(fiscalization || {}).length && fiscalization) || DFiscalization
    )
    const automatModeExeMaster = await AutomatSettingModeExeMaster.create(
      (Object.keys(modeExeMaster || {}).length && modeExeMaster) || DModeExeMaster
    )
    const automatModeMdb = await AutomatSettingModeMdb.create(
      (Object.keys(modeMdb || {}).length && modeMdb) || DModeMdb
    )
    const automatModeMdbExe = await AutomatSettingModeMdbExe.create(
      (Object.keys(modeMdbExe || {}).length && modeMdbExe) || DModeMdbExe
    )
    const automatModePulse = await AutomatSettingModePulse.create(
      (Object.keys(modePulse || {}).length && modePulse) || DModePulse
    )
    const automatModePose = await AutomatSettingModePose.create(
      (Object.keys(modePose || {}).length && modePose) || DModePose
    )
    const automatSchedule = await AutomatSettingSchedule.create(
      (Object.keys(schedule || {}).length && schedule) || DSchedule
    )

    const automatSettingCreated = await AutomatSetting.create({
      ...((Object.keys(setting || {}).length && setting) || DAutomatSetting),
      automatId: automatCreated.id,
      scheduleId: automatSchedule.id,
      fiscalizationId: automatFiscalization.id,
      modePoseId: automatModePose.id,
      modePulseId: automatModePulse.id,
      modeMdbId: automatModeMdb.id,
      modeMdbExeId: automatModeMdbExe.id,
      modeExeMasterId: automatModeExeMaster.id,
    })

    if (createChildren && createChildren.length) {
      await Automat.createMany(
        createChildren.map((child) => ({
          ...child,
          accountId: auth.user.accountId,
          parentId: automatCreated.id,
        }))
      )
    }

    response.send({ result: { automat: automatCreated, setting: automatSettingCreated } })
    logger.info(
      `${auth.user.email} created automat ${automat.id}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getAutomats = async ({ auth, response, request }) => {
  try {
    const { name } = request.qs()

    const { rows: automats } = await Database.rawQuery(
      `SELECT a.*,
        automat_marks.name as mark_name,
        automat_marks.id as mark_id,
        am.name as model_name,
        automat_settings.main_mode,
        automat_groups.name as group_name,
        (
          SELECT s.updated_at FROM sales s
          WHERE s.automat_id = a.id 
          ORDER BY s.updated_at DESC
          LIMIT 1
        ) as last_sale,
        (
          SELECT coalesce(cast(SUM(ap.max_value) as int),0)
          FROM automat_products ap 
          JOIN products p ON p.id = ap.product_id
          WHERE ap.automat_id = a.id AND p.recipe = false
        ) + coalesce(cast(SUM(r.max_volume) as int),0) as max_value,
        (
          SELECT coalesce(cast(SUM(ap.balance) as int),0)
          FROM automat_products ap 
          JOIN products p ON p.id = ap.product_id
          WHERE ap.automat_id = a.id AND p.recipe = false
        ) + coalesce(cast(SUM(r.balance) as int),0) as balance,
        (SELECT COUNT(id)::INTEGER FROM automat_products ap WHERE ap.automat_id = a.id) as products_count
      FROM automats a
        LEFT JOIN automat_groups ON automat_groups.id = a.group_id
        RIGHT JOIN automat_models am ON am.id = a.model_id
        RIGHT JOIN automat_marks ON automat_marks.id = am.automat_mark_id
        LEFT JOIN reserviors r on r.automat_id = a.id
        LEFT JOIN automat_products ap on ap.automat_id = a.id
        JOIN automat_settings ON automat_settings.automat_id = a.id
      WHERE a.account_id = :accountId AND a.parent_id IS NULL
      ${name ? "AND LOWER(a.name) LIKE LOWER('%" + name + "%')" : ''}
      GROUP BY a.id, automat_marks.id, am.name, automat_groups.name, automat_settings.main_mode
      ORDER BY a.updated_at DESC`,
      { accountId: auth.user.accountId }
    )

    response.send({ result: automats })
    logger.info(`${auth.user.email} got automats`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getAutomatsByFilter = async ({ auth, response, request }) => {
  try {
    const { page, pageSize, filter, sortedBy, sortedDesc } = request.qs()

    let filterSql = ''
    let options = 'ORDER BY updated_at DESC'

    if (sortedBy) {
      switch (sortedBy) {
        case 'address':
          options = `ORDER BY a.address->>'value' ${sortedDesc === 'true' ? 'DESC' : 'ASC'}`
          break
        default:
          options = `ORDER BY ${string.snakeCase(sortedBy)} ${
            sortedDesc === 'true' ? 'DESC' : 'ASC'
          }`
          break
      }
    }

    for (const key in filter) {
      switch (key) {
        case 'id':
          filterSql += ` AND a.id NOT IN (${filter[key].map((id: string) => +id).join(',')})`
          break
        case 'lastSaleStart':
          filterSql += ` AND last_sale >= :${key}`
          break
        case 'lastSaleEnd':
          filterSql += ` AND last_sale <= :${key}`
          break
        case 'lastServiceStart':
          filterSql += ` AND last_service >= :${key}`
          break
        case 'lastServiceEnd':
          filterSql += ` AND last_service <= :${key}`
          break
        case 'automatMarkId':
          filterSql += ` AND automat_marks.id = :${key}`
          break
        case 'modelId':
          filterSql += ` AND am.id = :${key}`
          break
        case 'groupId':
          filterSql += ` AND automat_groups.id = :${key}`
          break
        case 'productsCount':
          filterSql += ` AND CAST(products_count AS boolean) = ${strToBool(filter[key])}`
          break
        case 'name':
          filter[key] = `%${filter[key]}%`
          filterSql += ' AND LOWER(a.name) LIKE LOWER(:name)'
          break
        case 'address':
          filter[key] = `%${filter[key]}%`
          filterSql += " AND LOWER(a.address->>'value') LIKE LOWER(:address)"
          break
        default:
          filterSql += ` AND a.${string.snakeCase(key)} = :${key}`
          break
      }
    }

    const { rows: count } = await Database.rawQuery(
      `SELECT a.id
      FROM (
        SELECT 
          *,
          (
            SELECT r.updated_at FROM routes r
              JOIN route_automats ra ON r.id = ra.route_id
            WHERE ra.automat_id = automats.id AND r.status = '${RouteStatuses.DONE}'
            ORDER BY r.updated_at DESC
            LIMIT 1
          ) as last_service,
          (
            SELECT s.updated_at FROM sales s
            WHERE s.automat_id = automats.id 
            ORDER BY s.updated_at DESC
            LIMIT 1
          ) as last_sale,
          (SELECT COUNT(id)::INTEGER FROM automat_products ap WHERE ap.automat_id = automats.id) as products_count
        FROM automats
      ) a
        LEFT JOIN automat_groups ON automat_groups.id = a.group_id
        RIGHT JOIN automat_models am ON am.id = a.model_id
        RIGHT JOIN automat_marks ON automat_marks.id = am.automat_mark_id
        LEFT JOIN reserviors r on r.automat_id = a.id
        LEFT JOIN automat_products ap on ap.automat_id = a.id
      WHERE a.account_id = :accountId AND a.parent_id IS NULL ${filterSql}
      GROUP BY a.id`,
      { accountId: auth.user.accountId, ...filter }
    )

    const { rows } = await Database.rawQuery(
      `SELECT a.*,
        automat_marks.name as mark_name,
        automat_marks.id as mark_id,
        am.name as model_name,
        automat_settings.main_mode,
        automat_groups.name as group_name,
        (
          SELECT coalesce(cast(SUM(ap.max_value) as int),0)
          FROM automat_products ap 
          JOIN products p ON p.id = ap.product_id
          WHERE ap.automat_id = a.id AND p.recipe = false
        ) + coalesce(cast(SUM(r.max_volume) as int),0) as max_value,
        (
          SELECT coalesce(cast(SUM(ap.balance) as int),0)
          FROM automat_products ap 
          JOIN products p ON p.id = ap.product_id
          WHERE ap.automat_id = a.id AND p.recipe = false
        ) + coalesce(cast(SUM(r.balance) as int),0) as balance
      FROM (
        SELECT 
          *,
          (
            SELECT r.updated_at FROM routes r
              JOIN route_automats ra ON r.id = ra.route_id
            WHERE ra.automat_id = automats.id AND r.status = '${RouteStatuses.DONE}'
            ORDER BY r.updated_at DESC
            LIMIT 1
          ) as last_service,
          (
            SELECT s.updated_at FROM sales s
            WHERE s.automat_id = automats.id 
            ORDER BY s.updated_at DESC
            LIMIT 1
          ) as last_sale,
          (SELECT COUNT(id)::INTEGER FROM automat_products ap WHERE ap.automat_id = automats.id) as products_count
        FROM automats
      ) a
        LEFT JOIN automat_groups ON automat_groups.id = a.group_id
        RIGHT JOIN automat_models am ON am.id = a.model_id
        RIGHT JOIN automat_marks ON automat_marks.id = am.automat_mark_id
        LEFT JOIN reserviors r on r.automat_id = a.id
        JOIN automat_settings ON automat_settings.automat_id = a.id
      WHERE a.account_id = :accountId AND a.parent_id IS NULL ${filterSql}
      GROUP BY 
        a.id, a.name, a.number, a.longitude, a.latitude, a.phone, a.serial_number, a.inventory_number, a.comment, a.place, a.contact, 
        a.address, a.account_id, a.group_id, a.parent_id, a.model_id, a.created_at, a.updated_at, a.deleted_at, a.last_service, a.last_sale,
        a.products_count, automat_marks.id, am.name, automat_marks.name, automat_groups.name, automat_settings.main_mode, a.pulse_planogram_delivered_cube
      ${options}
      LIMIT :limit
      OFFSET :offset`,
      {
        accountId: auth.user.accountId,
        offset: count < +pageSize ? 0 : +page * +pageSize,
        limit: +pageSize,
        ...filter,
      }
    )

    response.send({ result: { rows, count: count.length, page: +page, pageSize: +pageSize } })
    logger.info(`${auth.user.email} got automats`, createLogMessage({ request, response }))
  } catch (error) {
    console.error(error)
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getAutomat = async ({ response, request, auth }) => {
  try {
    const { id } = request.params()
    const automat = await Automat.query()
      .where('id', id)
      .andWhere('accountId', auth.user.accountId)
      .first()

    response.send({ result: automat })
    logger.info(`${auth.user.email} got automat ${id}`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const deleteAutomats = async ({ request, response, auth }) => {
  try {
    await request.validate(DeleteAutomatValidator)

    const { automatsId } = request.body()

    for (const id of automatsId) {
      const automat = await Automat.query()
        .where('id', id)
        .andWhere('accountId', auth.user.accountId)
        .first()
      if (!automat) continue

      await Automat.query()
        .where('parent_id', id)
        .andWhere('accountId', auth.user.accountId)
        .delete()
      await AutomatProduct.query().where('automat_id', id).delete()

      const setting = await AutomatSetting.findBy('automatId', id)
      if (setting) {
        await setting?.delete()
        const fiscalization = await AutomatSettingFiscalization.findBy(
          'id',
          setting.fiscalizationId
        )
        const modeExeMaster = await AutomatSettingModeExeMaster.findBy(
          'id',
          setting.modeExeMasterId
        )
        const modeMdb = await AutomatSettingModeMdb.findBy('id', setting.modeMdbId)
        const modeMdbExe = await AutomatSettingModeMdbExe.findBy('id', setting.modeMdbExeId)
        const modePulse = await AutomatSettingModePulse.findBy('id', setting.modePulseId)
        const modePose = await AutomatSettingModePose.findBy('id', setting.modePoseId)
        const schedule = await AutomatSettingSchedule.findBy('id', setting.scheduleId)
        await fiscalization?.delete()
        await modeExeMaster?.delete()
        await modeMdb?.delete()
        await modeMdbExe?.delete()
        await modePulse?.delete()
        await modePose?.delete()
        await schedule?.delete()
      }

      await automat?.delete()
    }

    response.send({ result: true, message: Message.DELETED_AUTOMATS })
    logger.info(
      `${auth.user.email} deleted automats ${automatsId}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const updateAutomat = async ({ request, response, auth }) => {
  try {
    await request.validate(AutomatValidator)
    const { id } = request.params()
    const body = request.body()

    if (body?.name) {
      const [alreadyExists] = await Automat.query()
        .where('name', body.name)
        .andWhere('account_id', auth.user.accountId)
        .andWhere('id', '!=', id)
      if (alreadyExists) return response.badRequest({ message: Message.AUTOMAT_NAME_EXISTS })
    }

    let automat = await Automat.query()
      .where('id', id)
      .andWhere('accountId', auth.user.accountId)
      .first()

    if (!automat) return response.badRequest({ message: Message.NO_AUTOMAT })
    automat = await automat.merge(body).save()

    response.send({ result: automat })
    logger.info(`${auth.user.email} updated automat ${id}`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getAutomatModels = async ({ response, request }) => {
  try {
    const automatModels = await AutomatModel.all()
    const automatMarks = await AutomatMark.all()

    response.send({ result: { marks: automatMarks, models: automatModels } })
    logger.info(`got automat models`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const automatsMoveToGroup = async ({ request, response, auth }) => {
  try {
    await request.validate(MoveAutomatsValidator)
    const { automatsId, groupId } = request.body()

    const result: Automat[] = []

    if (automatsId.length) {
      for (let i = 0; i < automatsId.length; i++) {
        const automat = await Automat.query()
          .where('id', automatsId[i])
          .andWhere('accountId', auth.user.accountId)
          .first()

        if (!automat) continue
        result[i] = await automat.merge({ groupId }).save()
      }
    }

    response.send({ result, message: Message.SUCCESSFUL_UPDATEDS })
    logger.info(`moved automats to group`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}
