import logger, { createLogMessage } from '../../../libs/logger'
import {
  CreateDeviceValidator,
  ServiceMenuPinValidator,
  ServiceMenuValidator,
  UpdateServiceMenuPinValidator,
  UpdateSimNumberValidator,
} from 'App/Validators/CubeValidator'
import ServiceMenuLogin from 'App/Models/ServiceMenuLogin'
import ServiceMenuPin from 'App/Models/ServiceMenuPins'
import crypto from 'crypto'
import Device from 'App/Models/Device'
import UserAutomatPin from 'App/Models/UserAutomatPin'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import { string } from '@ioc:Adonis/Core/Helpers'
import { DeviceService } from 'App/Services/DeviceService'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export const createServiceMenuStatuses = async ({ auth, request, response }) => {
  try {
    await request.validate(ServiceMenuValidator)

    const { status, devicesId } = request.body()

    for (let i = 0; i < devicesId.length; i++) {
      const id = devicesId[i]
      const device = await Device.query()
        .where('id', id)
        .andWhere('accountId', auth.user.accountId)
        .first()
      if (!device) return response.badRequest({ message: `Куб с id ${id} не найден` })
    }

    const result = await ServiceMenuLogin.createMany(
      devicesId.map((id: number) => ({ deviceId: id, userId: auth.user.id, status }))
    )

    response.send({ result })
    logger.info('Создана команда для куба', createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.messages })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getServiceMenuStatuses = async ({ auth, request, response }) => {
  try {
    const result = await ServiceMenuLogin.query().where('userId', auth.user.id)

    response.send({ result })
    logger.info('Получены команды сервисного меню', createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.messages })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const createServiceMenuPins = async ({ auth, request, response }) => {
  try {
    await request.validate(ServiceMenuPinValidator)

    const { devicesId } = request.body()

    const result = {}

    for (let i = 0; i < devicesId.length; i++) {
      const id: number = devicesId[i]
      const device = await Device.query()
        .where('id', id)
        .andWhere('accountId', auth.user.accountId)
        .first()
      if (!device) continue

      const usrAutomatPin = await UserAutomatPin.updateOrCreate(
        {
          userId: auth.user.id,
          automatId: device.automatId,
        },
        { userId: auth.user.id, automatId: device.automatId }
      )

      const pin = await generator(auth.user.accountId)

      const pinHash = crypto
        .createHash('sha256')
        .update(`${pin}.${auth.user.superuser ? 1 : 2}.${device.deviceName}`)
        .digest('hex')

      const updated = await ServiceMenuPin.updateOrCreate(
        { id: usrAutomatPin.serviceMenuPinId || 0 },
        { pin, pinHash }
      )

      await usrAutomatPin.merge({ serviceMenuPinId: updated.id }).save()

      result[device.id] = pin
    }

    response.send({ result })
    logger.info('Пины для автоматов созданы', createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.messages })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const updateServiceMenuPins = async ({ auth, request, response }) => {
  try {
    await request.validate(UpdateServiceMenuPinValidator)

    const { devicesId, pin } = request.body()

    const result: ServiceMenuPin[] = []

    for (const deviceId of devicesId) {
      const device = await Device.query()
        .where('id', deviceId)
        .andWhere('accountId', auth.user.accountId)
        .first()
      if (!device) continue

      const pinHash = crypto
        .createHash('sha256')
        .update(`${pin}.${auth.user.superuser ? 1 : 2}.${device.deviceName}`)
        .digest('hex')

      const { rows: updated } = await Database.rawQuery(`
        UPDATE service_menu_pins smp
        SET pin = '${pin}', pin_hash = '${pinHash}'
        FROM user_automat_pins uap
        WHERE
          uap.automat_id = ${device.automatId}
          AND uap.user_id = ${auth.user.id}
        RETURNING smp.*
      `)
      result.push(updated)
    }

    response.send({ result })
    logger.info('Пин для устройства обновлено', createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.messages })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getDevices = async ({ auth, request, response }) => {
  try {
    const { rows: result } = await Database.rawQuery(
      `SELECT
        d.*,
        (
          SELECT jsonb_build_object('id', smp.id, 'pin', smp.pin, 'pin_hash', smp.pin_hash) as pins
          FROM user_automat_pins uap
          LEFT JOIN service_menu_pins smp ON uap.service_menu_pin_id = smp.id
          WHERE d.automat_id = uap.automat_id
          ORDER BY uap.id DESC
          LIMIT 1
        ) as pins,
        (
          SELECT jsonb_build_object('id', sml.id, 'status', sml.status, 'delivered_cube', sml.delivered_cube) as logins
          FROM service_menu_logins sml
          WHERE d.id = sml.device_id
          ORDER BY sml.id DESC
          LIMIT 1
        ) as logins,
        a.name as automat_name, a.group_id as automat_group_id
      FROM devices d
        LEFT JOIN automats a ON d.automat_id = a.id
      WHERE d.account_id = ${auth.user.accountId}
      GROUP BY d.id, a.name, a.group_id
      ORDER BY d.updated_at DESC`
    )

    response.send({ result })
    logger.info(
      `Получены все устройства аккаунта ${auth.user.accountId}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.messages })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getDevicesByFilter = async ({ auth, request, response }) => {
  try {
    const { page, pageSize, sortedBy, sortedDesc, filter } = request.qs()

    let options = 'ORDER BY updated_at DESC'
    let filterSql = ''

    if (sortedBy) {
      switch (sortedBy) {
        case 'pin':
          options = `ORDER BY pins->>'pin' ${sortedDesc === 'true' ? 'DESC' : 'ASC'}`
          break
        case 'pinHash':
          options = `ORDER BY pins->>'pin_hash' ${sortedDesc === 'true' ? 'DESC' : 'ASC'}`
          break
        case 'status':
          options = `ORDER BY logins->>'status' ${sortedDesc === 'true' ? 'DESC' : 'ASC'}`
          break
        case 'deliveredCube':
          options = `ORDER BY logins->>'delivered_cube' ${sortedDesc === 'true' ? 'DESC' : 'ASC'}`
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
        case 'automatGroupId':
          filterSql += ` AND a.group_id = :${key}`
          break
        case 'deviceName':
          filter[key] = `%${filter[key]}%`
          filterSql += ` AND LOWER(d.device_name) LIKE LOWER(:deviceName)`
          break
        default:
          filterSql += ` AND d.${string.snakeCase(key)} = :${key}`
          break
      }
    }

    const { rows: count } = await Database.rawQuery(
      `SELECT d.id FROM devices d
        LEFT JOIN automats a ON d.automat_id = a.id
      WHERE d.account_id = :accountId ${filterSql}
      GROUP BY d.id, a.name, a.group_id`,
      { accountId: auth.user.accountId, ...filter }
    )

    const { rows } = await Database.rawQuery(
      `SELECT
        d.*,
        (
          SELECT jsonb_build_object('id', smp.id, 'pin', smp.pin, 'pin_hash', smp.pin_hash) as pins
          FROM user_automat_pins uap
          LEFT JOIN service_menu_pins smp ON uap.service_menu_pin_id = smp.id
          WHERE d.automat_id = uap.automat_id
          ORDER BY uap.id DESC
          LIMIT 1
        ) as pins,
        (
          SELECT jsonb_build_object('id', sml.id, 'status', sml.status, 'delivered_cube', sml.delivered_cube) as logins
          FROM service_menu_logins sml
          WHERE d.id = sml.device_id
          ORDER BY sml.id DESC
          LIMIT 1
        ) as logins,
        a.name as automat_name, a.group_id as automat_group_id
      FROM devices d
        LEFT JOIN automats a ON d.automat_id = a.id
      WHERE d.account_id = :accountId ${filterSql}
      GROUP BY d.id, a.name, a.group_id
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

    response.send({ result: { count: count.length, rows, page: +page, pageSize: +pageSize } })
    logger.info(
      `Получены все устройства аккаунта ${auth.user.accountId}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.messages })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const updateSimNumbers = async ({ auth, request, response }) => {
  try {
    await request.validate(UpdateSimNumberValidator)

    const { numbers } = await request.body()

    const values = numbers
      .map(
        (device) =>
          `(
            ${device.deviceId},
            '${device?.simNumber || ''}',
            '${device?.comment || ''}',
            '${DateTime.now()}'::timestamptz
          )`
      )
      .join(',')

    const { rows: result } = await Database.rawQuery(
      `UPDATE devices SET sim_number = data.sim_number, comment = data.comment, updated_at = data.time
      FROM (values ${values}) as data (id, sim_number, comment, time)
      WHERE devices.id = data.id AND account_id = ${auth.user.accountId}
      RETURNING *`
    )

    response.send({ result })
    logger.info(
      `Обновлены устройства аккаунта ${auth.user.accountId}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.messages })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const createDeviceTest = async ({ auth, request, response }) => {
  try {
    await request.validate(CreateDeviceValidator)

    const body = request.body()

    const result = await Device.create({ ...body, accountId: auth.user.accountId })

    response.send({ result })
    logger.info('Устройство создана', createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.messages })
    logger.error(error, createLogMessage({ request, response }))
  }
}

/**
 * Create device
 */
export const createDevice = async ({ request, response }: HttpContextContract) => {
  try {
    return response.send(await DeviceService.create(request))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, error.messages, createLogMessage({ request, response }))
  }
}

/**
 * Delete device
 */
export const deleteDevice = async ({ request, response }: HttpContextContract) => {
  try {
    await DeviceService.delete(request)
    return response.status(200)
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, error.messages, createLogMessage({ request, response }))
  }
}

const generator = async (accountId: number): Promise<string> => {
  const pin = (Date.now() + Math.floor(Math.random() * 100)).toString().substring(7, 13)
  if (Number(pin) >= 999999) return generator(accountId)
  const duplicatePin = await ServiceMenuPin.query()
    .where('pin', pin)
    .andWhere('accountId', accountId)
    .first()
  if (duplicatePin) return generator(accountId)
  return pin
}
