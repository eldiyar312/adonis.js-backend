import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Account from 'App/Models/Account'

export default class AccountSeeder extends BaseSeeder {
  public async run() {
    await Account.create({})
  }
}
