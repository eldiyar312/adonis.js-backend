import { BaseModel, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Bank from './Bank'
import Account from './Account'
import { DateTime } from 'luxon'

export default class Application extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public organization: any // jsonb
  @column()
  public tradePoint: any // jsonb
  @column()
  public moneyBack: any // jsonb
  @column()
  public moneyTurnover: any // jsonb
  @column()
  public beneficiary: any // jsonb
  @column()
  public additionalDocuments: any // jsonb
  @column()
  public representer: any // jsonb
  @column()
  public finishedStep: number
  @column()
  public service: string
  @column()
  public client: string
  @column()
  public login: string
  @column()
  public password: string
  @column()
  public processedAt: string
  @column()
  public needDocuments: string
  @column()
  public needDocumentsCount: number
  @column()
  public publishedAt: unknown
  @column()
  public contract: string
  @column()
  public email: string

  @column()
  public bankId: number
  @column()
  public accountId: number

  @belongsTo(() => Bank)
  public Bank: BelongsTo<typeof Bank>
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
