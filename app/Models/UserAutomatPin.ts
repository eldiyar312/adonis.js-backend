import { DateTime } from 'luxon'
import { BaseModel, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Automat from './Automat'
import ServiceMenuPin from './ServiceMenuPins'

export default class UserAutomatPin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number
  @column()
  public automatId: number
  @column()
  public serviceMenuPinId: number

  @belongsTo(() => Automat)
  public Automat: BelongsTo<typeof Automat>
  @belongsTo(() => User)
  public User: BelongsTo<typeof User>
  @belongsTo(() => ServiceMenuPin)
  public ServiceMenuPin: BelongsTo<typeof ServiceMenuPin>

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
