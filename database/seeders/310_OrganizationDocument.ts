import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import OrganizationDocument from 'App/Models/OrganizationDocument'

export default class OrganizationDocumentSeeder extends BaseSeeder {
  public async run() {
    await OrganizationDocument.create({
      name: 'string',
      type: 'string',
      clientSign: 'string',
      accountId: 1,
      applicationId: 1,
      fileId: 1,
    })
  }
}
