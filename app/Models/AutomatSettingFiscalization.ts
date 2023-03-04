import { DateTime } from 'luxon'
import { BaseModel, beforeFind, column } from '@ioc:Adonis/Lucid/Orm'
import { TaxReporting } from '../../constants'

export default class AutomatSettingFiscalization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public settlementAddress: string
  @column()
  public settlementPlace: string
  @column()
  public automatNumber: string
  @column()
  public operationMode: number
  @column()
  public taxReporting: TaxReporting
  @column()
  public taxationSystem: number

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
