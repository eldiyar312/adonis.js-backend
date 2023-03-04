import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ReceiptAggregateWeek from 'App/Models/ReceiptAggregateWeek'
import { DateTime } from 'luxon'

export default class ReceiptAggregateWeekSeeder extends BaseSeeder {
  public async run() {
    await ReceiptAggregateWeek.create({
      count: 1,
      sumIn: 1,
      sumOut: 1,
      begin: DateTime.now(),
      end: DateTime.now(),
      types: {},
      positions: {},
      accountId: 1,
      automatId: 1,
      deviceId: 1,
    })
  }
}
