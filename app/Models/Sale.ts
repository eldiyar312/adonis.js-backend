import { DateTime } from 'luxon'
import { BaseModel, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'
import Automat from './Automat'
import AutomatGroup from './AutomatGroup'
import AutomatProduct from './AutomatProduct'
import PulsePlanogram from './PulsePlanogram'

export default class Sale extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public productName: string
  @column()
  public automatName: string
  @column()
  public groupName: string
  @column()
  public price: number
  @column()
  public quantity: number
  @column()
  public automatProductId: number
  @column()
  public pulsePlanogramId: number
  @column()
  public groupId: number
  @column()
  public automatId: number
  @column()
  public accountId: number

  @belongsTo(() => AutomatProduct)
  public AutomatProduct: BelongsTo<typeof AutomatProduct>
  @belongsTo(() => PulsePlanogram)
  public PulsePlanogram: BelongsTo<typeof PulsePlanogram>
  @belongsTo(() => AutomatGroup)
  public AutomatGroup: BelongsTo<typeof AutomatGroup>
  @belongsTo(() => Automat)
  public Automat: BelongsTo<typeof Automat>
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
