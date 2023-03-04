import { DateTime } from 'luxon'
import { BaseModel, beforeFind, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ProductCategory from './ProductCategory'
import Account from './Account'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
  @column()
  public sku: string
  @column()
  public unit: string
  @column()
  public price: number
  @column()
  public tax: string
  @column()
  public subject: string
  @column()
  public paymentMethodType: number
  @column()
  public img: string
  @column()
  public recipe: boolean

  @column()
  public productCategoryId: number
  @column()
  public accountId: number

  @belongsTo(() => ProductCategory)
  public ProductCategory: BelongsTo<typeof ProductCategory>
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
