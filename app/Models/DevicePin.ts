import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { softDelete } from 'App/Services/SoftDelete'
import Account from './Account'

export default class DevicePin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pin: string
  @column()
  public count: number

  @column()
  public accountId: number

  @belongsTo(() => Account)
  public Account: BelongsTo<typeof Account>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  @column.dateTime()
  public deletedAt: DateTime

  public softDelete(column?: string) {
    return softDelete(this, column)
  }

  public isSoftDeleted() {
    return this.deletedAt !== null
  }
}
