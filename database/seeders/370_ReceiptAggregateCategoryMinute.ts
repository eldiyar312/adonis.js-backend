import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ReceiptAggregateCategoryMinute from 'App/Models/ReceiptAggregateCategoryMinute'
import { DateTime } from 'luxon'

export default class ReceiptAggregateCategoryMinuteSeeder extends BaseSeeder {
  public async run() {
    await ReceiptAggregateCategoryMinute.create({
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
