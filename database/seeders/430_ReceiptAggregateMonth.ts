import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ReceiptAggregateMonth from 'App/Models/ReceiptAggregateMonth'
import { DateTime } from 'luxon'

export default class ReceiptAggregateMonthSeeder extends BaseSeeder {
  public async run() {
    await ReceiptAggregateMonth.create({
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
