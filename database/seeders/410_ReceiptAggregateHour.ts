import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ReceiptAggregateHour from 'App/Models/ReceiptAggregateHour'
import { DateTime } from 'luxon'

export default class ReceiptAggregateHourSeeder extends BaseSeeder {
  public async run() {
    await ReceiptAggregateHour.create({
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
