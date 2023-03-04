import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      name: 'sam',
      email: 'sam123@gmail.com',
      phone: '+19(0)231200',
      password: 'sadfjdifojLFJlj',
      active: false,
      accountId: 1,
      roleId: 1,
    })
  }
}
