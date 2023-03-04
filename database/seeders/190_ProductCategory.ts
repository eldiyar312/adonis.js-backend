import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ProductCategory from 'App/Models/ProductCategory'

export default class ProductCategorySeeder extends BaseSeeder {
  public async run() {
    ProductCategory.create({
      name: 'string',
      defaultSubject: 'string',
      defaultTax: 'string',
      defaultUnit: 'string',
      accountId: 1,
      parentId: 1,
    })
  }
}
