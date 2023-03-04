import { DateTime } from 'luxon'
import { BaseModel, beforeFind, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'

export default class ProductCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
  @column()
  public defaultSubject: string
  @column()
  public defaultTax: string
  @column()
  public defaultUnit: string

  @column()
  public accountId: number
  @column()
  public parentId: number

  @belongsTo(() => Account)
  public Account: BelongsTo<typeof Account>
  @belongsTo(() => ProductCategory)
  public ProductCategory: BelongsTo<typeof ProductCategory>

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
