import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ReceiptAggregateCategoryWeek from 'App/Models/ReceiptAggregateCategoryWeek'
import { DateTime } from 'luxon'

export default class ReceiptAggregateCategoryWeekSeeder extends BaseSeeder {
  public async run() {
    await ReceiptAggregateCategoryWeek.create({
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
