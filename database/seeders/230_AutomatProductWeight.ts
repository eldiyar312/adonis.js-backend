import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AutomatProductWeight from 'App/Models/AutomatProductWeight'

export default class AutomatProductWeightSeeder extends BaseSeeder {
  public async run() {
    await AutomatProductWeight.create({
      weight: 1,
      automatProductId: 1,
      automatId: 1,
      accountId: 1,
      ingredientId: 1,
    })
  }
}
