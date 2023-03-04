import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ReceiptAggregateMinute from 'App/Models/ReceiptAggregateMinute'
import { DateTime } from 'luxon'

export default class ReceiptAggregateMinuteSeeder extends BaseSeeder {
  public async run() {
    await ReceiptAggregateMinute.create({
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
