import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AutomatSetting from 'App/Models/AutomatSetting'
import { SalesStatisticSource } from '../../constants'

export default class AutomatSettingSeeder extends BaseSeeder {
  public async run() {
    await AutomatSetting.create({
      checkReport: true,
      salesStatisticSource: SalesStatisticSource.ANY,
      busInactiveTimeout: 1,
      mainMode: 1,
      clientEnable: 1,
      vmcAuditPortEnable: true,
      vmcAuditPort: 1,
      vmcAuditBaudRate: 1,
      vmcAuditProtocol: 1,
      scaleFactor: 1,
      decimalPlacesCash: 1,
      decimalPlacesCashless: 1,
      acquiringShiftCloseTime: 'string',
      acquiringShiftClosePeriod: 1,
      currencyCashless: 1,
      timezone: 1,
      keypadDirection: 1,
      timeoutVendingInProcess: 1,
      timeoutCancelButtonWhileVending: 1,
      qrCodeMode: 1,
      updateAcquiringConfigAfterShiftClose: true,
      loadWorkKeysAfterShiftClose: true,
      automatId: 1,
      scheduleId: 1,
      fiscalizationId: 1,
      modePoseId: 1,
      modePulseId: 1,
      modeMdbId: 1,
      modeMdbExeId: 1,
      modeExeMasterId: 1,
    })
  }
}
