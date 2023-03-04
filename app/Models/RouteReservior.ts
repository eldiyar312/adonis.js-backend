import { DateTime } from 'luxon'
import { BaseModel, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Reservior from './Reservior'
import Route from './Route'
import RouteAutomat from './RouteAutomat'

export default class RouteReservior extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public issued: number
  @column()
  public returned: number
  @column()
  public writeOff: number
  @column()
  public added: number
  @column()
  public estimatedBalance: number

  @column()
  public routeId: number
  @column()
  public routeAutomatId: number
  @column()
  public reserviorId: number

  @belongsTo(() => Route)
  public Route: BelongsTo<typeof Route>
  @belongsTo(() => RouteAutomat)
  public RouteAutomat: BelongsTo<typeof RouteAutomat>
  @belongsTo(() => Reservior)
  public Reservior: BelongsTo<typeof Reservior>

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
