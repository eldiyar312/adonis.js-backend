import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Product from 'App/Models/Product'

export default class ProductSeeder extends BaseSeeder {
  public async run() {
    await Product.create({
      name: 'test',
      sku: 'test',
      unit: 'test',
      price: 1,
      tax: 'test',
      subject: 'test',
      paymentMethodType: 1,
      img: 'test',
      productCategoryId: 1,
      accountId: 1,
      recipe: false,
    })
  }
}
