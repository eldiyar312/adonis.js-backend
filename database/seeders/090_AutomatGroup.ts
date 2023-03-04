import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AutomatGroup from 'App/Models/AutomatGroup'

export default class AutomatGroupSeeder extends BaseSeeder {
  public async run() {
    await AutomatGroup.create({
      name: 'string',
      accountId: 1,
    })
  }
}
