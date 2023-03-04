import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'
import Automat from './Automat'

export default class Device extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public deviceName: string
  @column()
  public activationDate: Date
  @column()
  public serialNumber: string
  @column()
  public comment: string
  @column()
  public simNumber: string

  @column()
  public accountId: number
  @column()
  public automatId: number

  @belongsTo(() => Account)
  public Account: BelongsTo<typeof Account>
  @belongsTo(() => Automat)
  public Automat: BelongsTo<typeof Automat>

  // @beforeFind()
  // public static ignoreDeleted(query) {
  //   query.whereNull('deleted_at')
  // }

  public isSoftDeleted() {
    return this.deletedAt !== null
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null
}
