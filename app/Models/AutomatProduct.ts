import { DateTime } from 'luxon'
import {
  afterUpdate,
  BaseModel,
  beforeFind,
  belongsTo,
  BelongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Automat from './Automat'
import Product from './Product'
import { deliveredCubeCancellation } from './hooks/General/deliveredCubeCancellation'

export default class AutomatProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public automatPrice: number
  @column()
  public maxValue: number
  @column()
  public balance: number
  @column()
  public slot: number
  @column()
  public deliveredCube: number

  @column()
  public automatId: number
  @column()
  public productId: number

  @belongsTo(() => Automat)
  public Automat: BelongsTo<typeof Automat>
  @belongsTo(() => Product)
  public Product: BelongsTo<typeof Product>

  @beforeFind()
  public static ignoreDeleted(query) {
    query.whereNull('deleted_at')
  }

  @afterUpdate()
  public static update(table: AutomatProduct) {
    deliveredCubeCancellation(table, AutomatProduct)
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
