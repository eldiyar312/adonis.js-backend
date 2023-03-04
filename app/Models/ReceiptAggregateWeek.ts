import { DateTime } from 'luxon'
import { BaseModel, beforeFind, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'
import Automat from './Automat'
import Device from './Device'

export default class ReceiptAggregateWeek extends BaseModel {
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
  public end: DateTime
  @column()
  public types: object
  @column()
  public positions: object

  @column()
  public accountId: number
  @column()
  public automatId: number
  @column()
  public deviceId: number

  @belongsTo(() => Account)
  public Account: BelongsTo<typeof Account>
  @belongsTo(() => Automat)
  public Automat: BelongsTo<typeof Automat>
  @belongsTo(() => Device)
  public Device: BelongsTo<typeof Device>

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
