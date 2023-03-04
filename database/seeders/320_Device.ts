import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Device from 'App/Models/Device'

export default class DeviceSeeder extends BaseSeeder {
  public async run() {
    await Device.createMany([
      {
        deviceName: '0219334C3153334B',
        activationDate: '2022-02-14' as unknown as Date,
      },
    ])
  }
}
