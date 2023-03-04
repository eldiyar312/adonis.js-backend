import Database from '@ioc:Adonis/Lucid/Database'
import { sendToUser } from 'App/Controllers/Http/routes/routes'
import { CronJob } from 'cron'

import { RouteStatuses } from '../../constants'
import logger, { createLogMessage } from '../../libs/logger'

/**
 * Check routes status. If route in status planed more than 1 day, then change status to 'overdue'
 */
const checkRoutesStatusAndUpdate = async () => {
  try {
    const { rows: routes } = await Database.rawQuery(`
      UPDATE routes SET status = '${RouteStatuses.OVERDUE}'
      WHERE status = '${RouteStatuses.PLANNED}' AND start_date < now() - INTERVAL '1 day'
    `)

    if (routes && routes.length) {
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i]
        await sendToUser(route)
      }

      logger.info(
        `change routes ${routes.map((r) => r.id)} status to overdue`,
        createLogMessage({ tag: 'cron', data: routes })
      )
    }
  } catch (err) {
    logger.error(err, createLogMessage({ tag: 'cron', data: err }))
  }
}

export const jobRouteToOverdue = new CronJob('0 */5 * * * *', checkRoutesStatusAndUpdate)
