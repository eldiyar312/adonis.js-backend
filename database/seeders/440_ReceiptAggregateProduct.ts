import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ReceiptAggregateProduct from 'App/Models/ReceiptAggregateProduct'
import { DateTime } from 'luxon'

export default class ReceiptAggregateProductSeeder extends BaseSeeder {
  public async run() {
    await ReceiptAggregateProduct.create({
      count: 1,
      sumIn: 1,
      sumOut: 1,
      begin: DateTime.now(),
      accountId: 1,
      automatId: 1,
      deviceId: 1,
    })
  }
}
