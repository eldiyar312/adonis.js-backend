import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    await Permission.createMany([{ resource: 'automats', access: 'write', roleId: 1 }])
  }
}
