import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RouteProduct from 'App/Models/RouteProduct'

export default class RouteProductSeeder extends BaseSeeder {
  public async run() {
    await RouteProduct.create({
      issued: 1,
      returned: 1,
      writeOff: 1,
      realBalance: 1,
      added: 1,
      estimatedBalance: 1,
      routeId: 1,
      automatProductId: 1,
    })
  }
}
