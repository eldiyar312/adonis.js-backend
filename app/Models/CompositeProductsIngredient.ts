import { DateTime } from 'luxon'
import { BaseModel, beforeFind, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Ingredient from './Ingredient'
import Product from './Product'

export default class CompositeProductsIngredient extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public weight: number
  @column()
  public price: number

  @column()
  public productId: number
  @column()
  public ingredientId: number

  @belongsTo(() => Product)
  public Product: BelongsTo<typeof Product>
  @belongsTo(() => Ingredient)
  public Ingredient: BelongsTo<typeof Ingredient>

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
