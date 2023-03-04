import { DateTime } from 'luxon'
import { BaseModel, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'
import Automat from './Automat'
import Device from './Device'

export default class Receipt extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public type: number
  @column()
  public content: object
  @column()
  public amount: number
  @column()
  public calculationAddress: string
  @column()
  public calculationPlace: string
  @column()
  public operationNumber: bigint
  @column()
  public fsNumber: string
  @column()
  public deviceSn: string
  @column()
  public deviceRn: string
  @column()
  public ofdName: string
  @column()
  public ofdWebsite: string
  @column()
  public ofdInn: string
  @column()
  public fnsWebsite: string
  @column()
  public documentIndex: string
  @column()
  public processedAt: DateTime
  @column()
  public processedAtTz: DateTime
  @column()
  public change: number
  @column()
  public fp: string
  @column()
  public companyInn: string
  @column()
  public companyName: string
  @column()
  public documentNumber: number
  @column()
  public returnCheckId: number
  @column()
  public operationMode: number
  @column()
  public fiscalizationStatus: number
  @column()
  public fiscalizationError: string
  @column()
  public isNonFiscal: boolean
  @column()
  public callbackUrl: string

  @column()
  public accountId: number
  @column()
  public automatId: number
  @column()
  public deviceId: number

  @belongsTo(() => Account)
  public Account: BelongsTo<typeof Account>
  @belongsTo(() => Automat)
  public Automat: BelongsTo<typeof Automat>
  @belongsTo(() => Device)
  public Device: BelongsTo<typeof Device>

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
