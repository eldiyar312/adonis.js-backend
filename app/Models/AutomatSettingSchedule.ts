import { DateTime } from 'luxon'
import { BaseModel, beforeFind, column } from '@ioc:Adonis/Lucid/Orm'

export default class AutomatSettingSchedule extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public weeks: string
  @column()
  public timeFrom: string
  @column()
  public timeTo: string
  @column()
  public period: number

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
