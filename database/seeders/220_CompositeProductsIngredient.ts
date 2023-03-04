import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CompositeProductsIngredient from 'App/Models/CompositeProductsIngredient'

export default class CompositeProductsIngredientSeeder extends BaseSeeder {
  public async run() {
    await CompositeProductsIngredient.create({
      weight: 1,
      price: 1,
      productId: 1,
      ingredientId: 1,
    })
  }
}
