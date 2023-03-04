import { DateTime } from 'luxon'
import {
  afterUpdate,
  BaseModel,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import { ServiceMenuStatus } from '../../constants'
import Device from './Device'
import User from './User'
import { deliveredCubeCancellation } from './hooks/General/deliveredCubeCancellation'

export default class ServiceMenuLogin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public status: ServiceMenuStatus
  @column()
  public deliveredCube: number

  @column()
  public userId: number
  @column()
  public deviceId: number

  @belongsTo(() => Device)
  public Device: BelongsTo<typeof Device>
  @belongsTo(() => User)
  public User: BelongsTo<typeof User>

  @beforeFind()
  public static ignoreDeleted(query) {
    query.whereNull('deleted_at')
  }

  @afterUpdate()
  public static update(table: ServiceMenuLogin) {
    deliveredCubeCancellation(table, ServiceMenuLogin)
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
