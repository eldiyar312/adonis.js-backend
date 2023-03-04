import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RouteReport from 'App/Models/RouteReport'

export default class RouteReportSeeder extends BaseSeeder {
  public async run() {
    await RouteReport.createMany([
      {
        name: 'Маршрут № 1',
        userName: 'Leo',
        startDate: '2021-07-09 07:19:20.9',
        endDate: '2021-07-10 07:19:20.9',
        period: '00:01:10.55715',
        userId: 1,
        accountId: 1,
      },
      {
        name: 'Маршрут № 1',
        userName: 'Leo',
        startDate: '2021-07-09 07:19:20.9',
        endDate: '2021-07-10 07:19:20.9',
        period: '00:01:10.55715',
        userId: 1,
        accountId: 1,
      },
      {
        name: 'Маршрут № 1',
        userName: 'Leo',
        startDate: '2021-07-09 07:19:20.9',
        endDate: '2021-07-10 07:19:20.9',
        period: '00:01:10.55715',
        userId: 1,
        accountId: 1,
      },
      {
        name: 'Маршрут № 1',
        userName: 'Leo',
        startDate: '2021-07-09 07:19:20.9',
        endDate: '2021-07-10 07:19:20.9',
        period: '00:01:10.55715',
        userId: 1,
        accountId: 1,
      },
      {
        name: 'Маршрут № 1',
        userName: 'Leo',
        startDate: '2021-07-09 07:19:20.9',
        endDate: '2021-07-10 07:19:20.9',
        period: '00:01:10.55715',
        userId: 1,
        accountId: 1,
      },
      {
        name: 'Маршрут № 1',
        userName: 'Leo',
        startDate: '2021-07-09 07:19:20.9',
        endDate: '2021-07-10 07:19:20.9',
        period: '00:01:10.55715',
        userId: 1,
        accountId: 1,
      },
    ])
  }
}
