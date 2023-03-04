import { DateTime } from 'luxon'
import { BaseModel, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Automat from './Automat'
import Account from './Account'
import Ingredient from './Ingredient'
import AutomatProduct from './AutomatProduct'

export default class AutomatProductWeight extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public weight: number

  @column()
  public automatProductId: number
  @column()
  public automatId: number
  @column()
  public accountId: number
  @column()
  public ingredientId: number

  @belongsTo(() => AutomatProduct)
  public AutomatProduct: BelongsTo<typeof AutomatProduct>
  @belongsTo(() => Automat)
  public Automat: BelongsTo<typeof Automat>
  @belongsTo(() => Account)
  public Account: BelongsTo<typeof Account>
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
