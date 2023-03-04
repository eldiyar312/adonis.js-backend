import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Route from 'App/Models/Route'
import { RouteStatuses } from '../../constants'
import { DateTime } from 'luxon'

export default class RouteSeeder extends BaseSeeder {
  public async run() {
    await Route.create({
      name: 'Обслужка',
      number: 1,
      startDate: DateTime.now().toString(),
      status: RouteStatuses.DONE,
      operatorId: 1,
      adminId: 1,
      accountId: 1,
    })
  }
}
