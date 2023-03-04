import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AutomatSettingSchedule from 'App/Models/AutomatSettingSchedule'

export default class AutomatSettingScheduleSeeder extends BaseSeeder {
  public async run() {
    await AutomatSettingSchedule.create({
      weeks: JSON.stringify(['thu']),
      timeFrom: '11:00',
      timeTo: '12:00',
      period: 1,
    })
  }
}
