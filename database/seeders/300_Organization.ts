import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Organization from 'App/Models/Organization'
import { OrganizationsPartnerStatus } from '../../constants'
import { DateTime } from 'luxon'

export default class OrganizationSeeder extends BaseSeeder {
  public async run() {
    await Organization.create({
      name: 'test- stirng',
      registrationDate: DateTime.now(),
      inn: 'test- stirng',
      ogrn: 'test- stirng',
      okpo: 'test- stirng',
      legalAddress: 'JSON',
      realAddress: 'JSON',
      legalOffice: 'test- stirng',
      realOffice: 'test- stirng',
      fio: 'test- stirng',
      phone: 'test- stirng',
      email: 'test- stirng',
      authority: 'test- stirng',
      directorAddress: 'JSON',
      authorityDocument: 'test- stirng',
      authorityDate: DateTime.now(),
      authorityNumber: 'test- stirng',
      authorityValidFrom: DateTime.now(),
      authorityValidUntil: DateTime.now(),
      partnerStatus: OrganizationsPartnerStatus.GOLD,
      birthDate: DateTime.now(),
      kpp: 'test- stirng',
      taxSystem: 1,
      tradeName: 'test- stirng',
      dadata: 'JSON',
      opf: 'test- stirng',
      passportSerial: 'test- stirng',
      passportNumber: 'test- stirng',
      passportAuthority: 'test- stirng',
      englishName: 'test- stirng',
      accountId: 1,
    })
  }
}
