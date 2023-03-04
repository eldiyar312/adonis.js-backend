import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AutomatProduct from 'App/Models/AutomatProduct'

export default class AutomatProductSeeder extends BaseSeeder {
  public async run() {
    await AutomatProduct.create({
      automatPrice: 1,
      maxValue: 1,
      balance: 1,
      slot: 1,
      automatId: 1,
      productId: 1,
    })
  }
}
