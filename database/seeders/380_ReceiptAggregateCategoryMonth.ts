import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ReceiptAggregateCategoryMonth from 'App/Models/ReceiptAggregateCategoryMonth'
import { DateTime } from 'luxon'

export default class ReceiptAggregateCategoryMonthSeeder extends BaseSeeder {
  public async run() {
    await ReceiptAggregateCategoryMonth.create({
      count: 1,
      sumIn: 1,
      sumOut: 1,
      begin: DateTime.now(),
      end: DateTime.now(),
      accountId: 1,
      automatId: 1,
      deviceId: 1,
    })
  }
}
