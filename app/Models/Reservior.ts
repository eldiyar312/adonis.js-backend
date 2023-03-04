import { DateTime } from 'luxon'
import { BaseModel, beforeFind, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'
import Automat from './Automat'
import Ingredient from './Ingredient'

export default class Reservior extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
  @column()
  public number: number
  @column()
  public maxVolume: number
  @column()
  public unit: string
  @column()
  public balance: number // Текущий количество (остаток)

  @column()
  public automatId: number
  @column()
  public accountId: number
  @column()
  public ingredientId: number

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
