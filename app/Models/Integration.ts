import { DateTime } from 'luxon'
import { BaseModel, beforeFind, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'

export default class Integration extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public service: string
  @column()
  public publicKey: string
  @column({ serializeAs: null })
  public privateKey: string

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
