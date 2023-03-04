import { CronJob } from 'cron'
import DevicePin from 'App/Models/DevicePin'
import moment from 'moment'
import { DateTime } from 'luxon'
import { PIN_DELETE_TIME, PIN_EXPIRATION_TIME } from '../../constants'

/**
 * Checks and deletes expired pins
 */
const expirationPins = async () => {
  const notExpiredFrom = (expirationTime) =>
    DateTime.fromJSDate(moment().subtract(expirationTime).toDate())

  await DevicePin.query()
    .where('createdAt', '<', `${notExpiredFrom(PIN_EXPIRATION_TIME)}`)
    .softDelete()
  await DevicePin.query()
    .where('createdAt', '<', `${notExpiredFrom(PIN_DELETE_TIME)}`)
    .delete()
}

export const pinExpirationJob = new CronJob('* * * * *', expirationPins)
