import { DateTime } from 'luxon'
import { afterUpdate, BaseModel, beforeFind, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import {
  ClientEnable,
  KeypadDirection,
  MainMode,
  SalesStatisticSource,
  VMCAuditProtocol,
} from '../../constants'
import Automat from './Automat'
import AutomatSettingSchedule from './AutomatSettingSchedule'
import AutomatSettingFiscalization from './AutomatSettingFiscalization'
import AutomatSettingModePose from './AutomatSettingModePose'
import AutomatSettingModePulse from './AutomatSettingModePulse'
import AutomatSettingModeMdb from './AutomatSettingModeMdb'
import AutomatSettingModeMdbExe from './AutomatSettingModeMdbExe'
import AutomatSettingModeExeMaster from './AutomatSettingModeExeMaster'
import { deliveredCubeCancellation } from './hooks/General/deliveredCubeCancellation'

export default class AutomatSetting extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public checkReport: boolean
  @column()
  public salesStatisticSource: SalesStatisticSource
  @column()
  public busInactiveTimeout: number
  @column()
  public mainMode: MainMode
  @column()
  public clientEnable: ClientEnable
  @column()
  public vmcAuditPortEnable: boolean
  @column()
  public vmcAuditPort: number
  @column()
  public vmcAuditBaudRate: number
  @column()
  public vmcAuditProtocol: VMCAuditProtocol
  @column()
  public scaleFactor: number
  @column()
  public decimalPlacesCash: number
  @column()
  public decimalPlacesCashless: number
  @column()
  public acquiringShiftCloseTime: string
  @column()
  public acquiringShiftClosePeriod: number
  @column()
  public currencyCashless: number
  @column()
  public timezone: number
  @column()
  public keypadDirection: KeypadDirection
  @column()
  public timeoutVendingInProcess: number
  @column()
  public timeoutCancelButtonWhileVending: number
  @column()
  public qrCodeMode: number
  @column()
  public updateAcquiringConfigAfterShiftClose: boolean
  @column()
  public loadWorkKeysAfterShiftClose: boolean
  @column()
  public deliveredCube: number

  @column()
  public automatId: number
  @column()
  public scheduleId: number
  @column()
  public fiscalizationId: number
  @column()
  public modePoseId: number
  @column()
  public modePulseId: number
  @column()
  public modeMdbId: number
  @column()
  public modeMdbExeId: number
  @column()
  public modeExeMasterId: number

  @hasOne(() => Automat)
  public Automat: HasOne<typeof Automat>
  @hasOne(() => AutomatSettingSchedule)
  public AutomatSettingSchedule: HasOne<typeof AutomatSettingSchedule>
  @hasOne(() => AutomatSettingFiscalization)
  public AutomatSettingFiscalization: HasOne<typeof AutomatSettingFiscalization>
  @hasOne(() => AutomatSettingModePose)
  public AutomatSettingModePose: HasOne<typeof AutomatSettingModePose>
  @hasOne(() => AutomatSettingModePulse)
  public AutomatSettingModePulse: HasOne<typeof AutomatSettingModePulse>
  @hasOne(() => AutomatSettingModeMdb)
  public AutomatSettingModeMdb: HasOne<typeof AutomatSettingModeMdb>
  @hasOne(() => AutomatSettingModeMdbExe)
  public AutomatSettingModeMdbExe: HasOne<typeof AutomatSettingModeMdbExe>
  @hasOne(() => AutomatSettingModeExeMaster)
  public AutomatSettingModeExeMaster: HasOne<typeof AutomatSettingModeExeMaster>

  @beforeFind()
  public static ignoreDeleted(query) {
    query.whereNull('deleted_at')
  }

  @afterUpdate()
  public static update(table: AutomatSetting) {
    deliveredCubeCancellation(table, AutomatSetting)
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
