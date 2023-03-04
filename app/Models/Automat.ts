import { DateTime } from 'luxon'
import { BaseModel, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'
import AutomatGroup from './AutomatGroup'
import AutomatModel from './AutomatModel'

export default class Automat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
  @column()
  public number: number
  @column()
  public longitude: string
  @column()
  public latitude: string
  @column()
  public phone: string
  @column()
  public serialNumber: string
  @column()
  public inventoryNumber: string
  @column()
  public comment: string
  @column()
  public place: string
  @column()
  public contact: string
  @column()
  public address: string
  @column()
  public pulsePlanogramDeliveredCube: number

  @column()
  public accountId: number
  @column()
  public groupId: number
  @column()
  public parentId: number
  @column()
  public modelId: number

  @belongsTo(() => Account)
  public Account: BelongsTo<typeof Account>
  @belongsTo(() => AutomatGroup)
  public AutomatGroup: BelongsTo<typeof AutomatGroup>
  @belongsTo(() => Automat)
  public Automat: BelongsTo<typeof Automat>
  @belongsTo(() => AutomatModel)
  public AutomatModel: BelongsTo<typeof AutomatModel>

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
