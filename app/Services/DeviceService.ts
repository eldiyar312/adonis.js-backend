import { PinService } from 'App/Services/PinService'
import { CreateDeviceValidator, DeleteDeviceValidator } from 'App/Validators/DeviceValidator'
import Device from 'App/Models/Device'
import DevicePin from 'App/Models/DevicePin'
import Account from 'App/Models/Account'
import { Message } from '../../constants'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export class DeviceService {
  public static async create(req: RequestContract) {
    const { accountId, pin, deviceName } = await req.validate(CreateDeviceValidator)

    const pinItem = await PinService.validate(pin)
    const device = await Device.query().where('deviceName', deviceName).first()

    if (device && device.accountId !== accountId && !device.deletedAt)
      throw new Error(Message.DEVICE_ALREADY_IN_USE)

    const account = await Account.findBy('id', pinItem.accountId)
    if (!account) new Error(Message.ACCOUNT_NOT_FOUND)

    await Database.transaction(async (trx) => {
      await DevicePin.query().where('id', pinItem.id).increment('count', 1).useTransaction(trx)
      if (!device) {
        await new Device()
          .useTransaction(trx)
          .fill({ deviceName: deviceName, activationDate: new Date(), accountId })
          .save()
      } else if (device.deletedAt) {
        await device
          .useTransaction(trx)
          .merge({ activationDate: new Date(), accountId: account?.id, deletedAt: null })
          .save()
      }
    })

    return account
  }

  public static async delete(req: RequestContract) {
    const { pin, deviceName } = await req.validate(DeleteDeviceValidator)

    const pinItem = await PinService.validate(pin)
    const device = await Device.query().where('deviceName', deviceName).first()

    if (!device) throw new Error(Message.DEVICE_NOT_FOUND)
    if (device.accountId !== pinItem.accountId) throw new Error(Message.CUBE_DEVICE_CONFLICT)

    await Database.transaction(async (trx) => {
      await device
        .useTransaction(trx)
        .merge({
          accountId: undefined,
          automatId: undefined,
          activationDate: undefined,
          deletedAt: DateTime.now(),
        })
        .save()
      await DevicePin.query().where('id', pinItem.id).increment('count', 1).useTransaction(trx)
    })

    return true
  }
}
