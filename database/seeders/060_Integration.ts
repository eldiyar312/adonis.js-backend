import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Integration from 'App/Models/Integration'

export default class IntegrationSeeder extends BaseSeeder {
  public async run() {
    await Integration.create({
      publicKey: 'RSA',
      privateKey: 'RSA',
      accountId: 1,
    })
  }
}
