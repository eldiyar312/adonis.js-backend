import { DateTime } from 'luxon'
import { BaseModel, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Route from './Route'
import Automat from './Automat'

export default class RouteAutomat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public position: number
  @column()
  public loadedAt: DateTime | null

  @column()
  public routeId: number
  @column()
  public automatId: number

  @belongsTo(() => Route)
  public Route: BelongsTo<typeof Route>
  @belongsTo(() => Automat)
  public Automat: BelongsTo<typeof Automat>

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
