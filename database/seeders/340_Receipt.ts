import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Receipt from 'App/Models/Receipt'
import { DateTime } from 'luxon'

export default class ReceiptSeeder extends BaseSeeder {
  public async run() {
    await Receipt.create({
      type: 1,
      content: {},
      amount: 1,
      calculationAddress: 'test-111',
      calculationPlace: 'test-111',
      operationNumber: BigInt(1231231),
      fsNumber: 'test-111',
      deviceSn: 'test-111',
      deviceRn: 'test-111',
      ofdName: 'test-111',
      ofdWebsite: 'test-111',
      ofdInn: 'test-111',
      fnsWebsite: 'test-111',
      documentIndex: 'test-111',
      processedAt: DateTime.now(),
      processedAtTz: DateTime.now(),
      change: 1,
      fp: 'test-111',
      companyInn: 'test-111',
      companyName: 'test-111',
      documentNumber: 1,
      returnCheckId: 1,
      operationMode: 1,
      fiscalizationStatus: 1,
      fiscalizationError: 'test-111',
      isNonFiscal: true,
      callbackUrl: 'test-111',
      accountId: 1,
      automatId: 1,
      deviceId: 1,
    })
  }
}
