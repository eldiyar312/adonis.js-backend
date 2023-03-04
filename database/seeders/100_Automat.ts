import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Automat from 'App/Models/Automat'

export default class AutomatSeeder extends BaseSeeder {
  public async run() {
    await Automat.create({
      name: 'string',
      longitude: 'string',
      latitude: 'string',
      phone: 'string',
      serialNumber: 'string',
      inventoryNumber: 'string',
      comment: 'string',
      place: 'string',
      contact: 'string',
      address: JSON.stringify({}),
      modelId: 1,
      accountId: 1,
    })
  }
}
