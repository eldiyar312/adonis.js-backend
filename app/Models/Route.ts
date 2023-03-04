import { DateTime } from 'luxon'
import { BaseModel, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { RouteStatuses } from '../../constants'
import User from './User'
import Account from './Account'

export default class Route extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
  @column()
  public number: number
  @column()
  public startDate: string
  @column()
  public status: RouteStatuses
  @column()
  public automaticDone: boolean
  @column()
  public dateDone: DateTime | null

  @column()
  public operatorId: number
  @column()
  public adminId: number // route creator
  @column()
  public accountId: number

  @belongsTo(() => User)
  public UserOperator: BelongsTo<typeof User>
  @belongsTo(() => User)
  public UserAdmin: BelongsTo<typeof User>
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
