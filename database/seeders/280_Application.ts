import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from 'App/Models/Application'
import { DateTime } from 'luxon'

export default class ApplicationSeeder extends BaseSeeder {
  public async run() {
    await Application.create({
      organization: {},
      tradePoint: {},
      moneyBack: {},
      moneyTurnover: {},
      beneficiary: [{}],
      additionalDocuments: [{}],
      finishedStep: 1,
      service: 'string',
      client: 'string',
      login: 'string',
      password: 'string',
      processedAt: 'string',
      needDocuments: 'string',
      needDocumentsCount: 1,
      publishedAt: DateTime.now(),
      contract: 'string',
      email: 'string',
      accountId: 1,
    })
  }
}
