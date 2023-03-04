import { DateTime } from 'luxon'
import { BaseModel, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { OrganizationsPartnerStatus } from '../../constants'
import Account from './Account'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
  @column()
  public registrationDate: DateTime
  @column()
  public inn: string
  @column()
  public ogrn: string
  @column()
  public okpo: string
  @column()
  public legalAddress: string
  @column()
  public realAddress: string
  @column()
  public legalOffice: string
  @column()
  public realOffice: string
  @column()
  public fio: string
  @column()
  public phone: string
  @column()
  public email: string
  @column()
  public authority: string
  @column()
  public directorAddress: string
  @column()
  public authorityDocument: string
  @column()
  public authorityDate: DateTime
  @column()
  public authorityNumber: string
  @column()
  public authorityValidFrom: DateTime
  @column()
  public authorityValidUntil: DateTime
  @column()
  public partnerStatus: OrganizationsPartnerStatus
  @column()
  public birthDate: DateTime
  @column()
  public kpp: string
  @column()
  public taxSystem: number
  @column()
  public tradeName: string
  @column()
  public dadata: string
  @column()
  public opf: string
  @column()
  public passportSerial: string
  @column()
  public passportNumber: string
  @column()
  public passportAuthority: string
  @column()
  public englishName: string

  @column()
  public accountId: number

  @belongsTo(() => Account)
  public Account: BelongsTo<typeof Account>

  @beforeFind()
  public static ignoreDeleted(query) {
    query.whereNull('deleted_at')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
