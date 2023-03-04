import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import File from 'App/Models/File'

export default class FileSeeder extends BaseSeeder {
  public async run() {
    await File.create({
      name: 'type',
      mimeType: 'type',
      encoding: 'type',
      size: 128,
    })
  }
}
