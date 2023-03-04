import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Superuser from 'App/Models/Superuser'

export default class SuperuserSeeder extends BaseSeeder {
  public async run() {
    await Superuser.create({
      userId: 1,
    })
  }
}
