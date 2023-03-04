import { DateTime } from 'luxon'
import { BaseModel, beforeFind, column } from '@ioc:Adonis/Lucid/Orm'

export default class CoreReceipt extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  public content: object

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
