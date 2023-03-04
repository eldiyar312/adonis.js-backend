import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    await Role.createMany([
      { code: 'ADMIN', name: 'Администратор' },
      { code: 'VENDING_OPERATOR', name: 'Оператор вендинга' },
    ])
  }
}
