import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Bank from 'App/Models/Bank'

export default class BankSeeder extends BaseSeeder {
  public async run() {
    await Bank.createMany([
      { id: 1, name: 'psb', finst: 3012, groupId: 167 },
      { id: 2, name: 'mts', finst: 3012, groupId: 166 },
      { id: 3, name: 'vtb', finst: 3012, groupId: 165 },
    ])
  }
}
