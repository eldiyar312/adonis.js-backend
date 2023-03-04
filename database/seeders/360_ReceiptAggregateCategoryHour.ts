import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ReceiptAggregateCategoryHour from 'App/Models/ReceiptAggregateCategoryHour'
import { DateTime } from 'luxon'

export default class ReceiptAggregateCategoryHourSeeder extends BaseSeeder {
  public async run() {
    await ReceiptAggregateCategoryHour.create({
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
