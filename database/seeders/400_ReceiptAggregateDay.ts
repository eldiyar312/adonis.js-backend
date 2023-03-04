import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ReceiptAggregateDay from 'App/Models/ReceiptAggregateDay'
import { DateTime } from 'luxon'

export default class ReceiptAggregateDaySeeder extends BaseSeeder {
  public async run() {
    await ReceiptAggregateDay.create({
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
