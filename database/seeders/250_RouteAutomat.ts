import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RouteAutomat from 'App/Models/RouteAutomat'

export default class RouteAutomatSeeder extends BaseSeeder {
  public async run() {
    await RouteAutomat.create({
      routeId: 1,
      automatId: 1,
    })
  }
}
