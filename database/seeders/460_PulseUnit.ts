import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PulseUnit from 'App/Models/PulseUnit'

export default class PulseUnitSeeder extends BaseSeeder {
  public async run() {
    await PulseUnit.createMany([
      {
        name: 'Игра',
        choiceStep: 1,
      },
      {
        name: 'Минута',
        choiceStep: 2,
      },
      {
        name: 'Рубль',
        choiceStep: 3,
      },
      {
        name: 'Миллилитр',
        choiceStep: 4,
      },
      {
        name: 'Литр',
        choiceStep: 5,
      },
    ])
  }
}
