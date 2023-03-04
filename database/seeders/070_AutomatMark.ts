import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AutomatMark from 'App/Models/AutomatMark'

export default class AutomatMarkSeeder extends BaseSeeder {
  public async run() {
    await AutomatMark.createMany([
      { name: 'ORANFRESH' },
      { name: 'Automatic Products' },
      { name: 'Копиркин' },
      { name: 'MVM' },
      { name: 'Unicum' },
      { name: 'Gerhardt' },
      { name: 'GPE Vendors' },
      { name: 'Necta' },
      { name: 'Бахилкин' },
      { name: 'Azkoyen' },
      { name: 'Shaerer' },
      { name: 'Акваматик' },
      { name: 'Fuji Electric' },
      { name: 'BullsEye' },
      { name: 'Nespresso' },
      { name: 'Bianchi' },
      { name: 'WMF' },
      { name: 'KIMMA' },
      { name: 'Dixie-Narco' },
      { name: 'Comestero' },
      { name: 'Jofemar' },
      { name: 'Wurlitzer' },
      { name: 'Saeco' },
      { name: 'Elektral' },
      { name: 'Nova' },
      { name: 'Дельта' },
      { name: 'Omnimatic' },
      { name: 'Shaker-M' },
      { name: 'Jura' },
      { name: 'FastCorp' },
      { name: 'Technomil' },
      { name: 'Vendstyle' },
      { name: 'IVT' },
      { name: 'Spengler' },
      { name: 'Crane' },
      { name: 'Cafitesse' },
      { name: 'FAS' },
      { name: 'Sanden Vendo' },
      { name: 'Rheavendors' },
    ])
  }
}
