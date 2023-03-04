import moment from 'moment/moment'
import DevicePin from 'App/Models/DevicePin'
import { PIN_EXPIRATION_TIME } from '../../constants'

export class PinService {
  private static MAX_TRY_COUNT = 12

  private static getRandomNumber(min, max) {
    const int = Math.floor(Math.random() * (max - min + 1)) + min // eslint-disable-line no-mixed-operators
    return `${int}`.padStart(`${max}`.length, '0')
  }

  public static async create(auth) {
    let monthsToSubtract = 12
    let createdPin
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < this.MAX_TRY_COUNT; i += 1) {
      const generatedPin = this.getRandomNumber(0, 999999)
      const dateTime = moment().subtract(monthsToSubtract, 'month')

      const existingDevicePin = await DevicePin.query()
        .where('pin', generatedPin)
        .andWhere('createdAt', '>', `${dateTime.format('YYYY-MM-DD 00:00')}`)
        .first()

      if (!existingDevicePin) {
        createdPin = await new DevicePin()
          .fill({
            pin: generatedPin,
            accountId: auth.user.accountId,
            count: 0,
          })
          .save()
        break
      }
      if (i === 9 && monthsToSubtract > 1) {
        i = 0
        monthsToSubtract -= 1
      }
    }

    return createdPin
  }

  public static async list(auth) {
    return DevicePin.query().where('accountId', auth.user.accountId).whereNull('deletedAt')
  }

  /**
   * Delete Device Pin
   */
  public static async delete(auth, req) {
    const { id } = req.params()
    const pin = await DevicePin.query()
      .where('id', id)
      .andWhere('account_id', auth.user.accountId)
      .first()

    if (!pin) throw new Error('Пин код не найден')

    return pin.softDelete()
  }

  /**
   * Validate Pin while devices creating/deleting
   */
  public static async validate(value) {
    if (!value) throw new Error('Pin не передан')

    const pin = await DevicePin.findBy('pin', value)
    if (!pin) throw new Error('Pin не существует')

    if (pin.isSoftDeleted() || moment().isAfter(moment(pin.createdAt).add(PIN_EXPIRATION_TIME))) {
      throw new Error('Pin устарел')
    }
    return pin
  }
}
