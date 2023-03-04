import { DateTime } from 'luxon'
import { BaseModel, beforeFind, column } from '@ioc:Adonis/Lucid/Orm'

export default class ServiceMenuPin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pin: string
  @column()
  public pinHash: string

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
