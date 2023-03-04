import { DateTime } from 'luxon'
import {
  afterSave,
  BaseModel,
  beforeFind,
  belongsTo,
  BelongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'
import Automat from './Automat'
import PulseUnit from './PulseUnit'
import { deliveredCubeCancellation } from './hooks/General/deliveredCubeCancellation'

export default class PulsePlanogram extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public buttonIndex: number
  @column()
  public pulseIndexExit: number
  @column()
  public productName: string
  @column()
  public count: number
  @column()
  public unitPrice: number

  @column()
  public pulseUnitId: number
  @column()
  public automatId: number
  @column()
  public accountId: number
  @column()
  public tax: number

  @belongsTo(() => PulseUnit)
  public PulseUnit: BelongsTo<typeof PulseUnit>
  @belongsTo(() => Automat)
  public Automat: BelongsTo<typeof Automat>
  @belongsTo(() => Account)
  public Account: BelongsTo<typeof Account>

  @beforeFind()
  public static ignoreDeleted(query) {
    query.whereNull('deleted_at')
  }

  @afterSave()
  public static update(table: PulsePlanogram) {
    deliveredCubeCancellation(table, PulsePlanogram)
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
