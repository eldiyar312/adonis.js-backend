import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Ingredient from 'App/Models/Ingredient'

export default class IngredientSeeder extends BaseSeeder {
  public async run() {
    await Ingredient.create({
      name: 'string',
      unit: 'string',
      price: 1,
      sku: 'string',
      tax: 'string',
      weight: 1,
      img: 'http://img.com/hello.png',
      accountId: 1,
    })
  }
}
