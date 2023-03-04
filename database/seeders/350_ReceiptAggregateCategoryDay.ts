import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ReceiptAggregateCategoryDay from 'App/Models/ReceiptAggregateCategoryDay'
import { DateTime } from 'luxon'

export default class ReceiptAggregateCategoryDaySeeder extends BaseSeeder {
  public async run() {
    await ReceiptAggregateCategoryDay.create({
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
