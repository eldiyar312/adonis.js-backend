import { DateTime } from 'luxon'
import { BaseModel, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'
import Automat from './Automat'
import Device from './Device'
import Product from './Product'
import PulsePlanogram from './PulsePlanogram'

export default class ReceiptAggregateProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public count: number
  @column()
  public sumIn: number
  @column()
  public sumOut: number
  @column()
  public begin: DateTime

  @column()
  public accountId: number
  @column()
  public automatId: number
  @column()
  public deviceId: number
  @column()
  public productId: number
  @column()
  public pulsePlanogramId: number

  @belongsTo(() => Account)
  public Account: BelongsTo<typeof Account>
  @belongsTo(() => Automat)
  public Automat: BelongsTo<typeof Automat>
  @belongsTo(() => Device)
  public Device: BelongsTo<typeof Device>
  @belongsTo(() => Product)
  public Product: BelongsTo<typeof Product>
  @belongsTo(() => PulsePlanogram)
  public PulsePlanogram: BelongsTo<typeof PulsePlanogram>

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
