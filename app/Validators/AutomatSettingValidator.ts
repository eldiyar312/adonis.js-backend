import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  CCAuditProtocol,
  ClientEnable,
  KeypadDirection,
  MainMode,
  PosMode,
  SalesStatisticSource,
  TaxReporting,
  VMCAuditProtocol,
} from '../../constants'

export default class AutomatSettingValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string.optional({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string.optional({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    setting: schema.object.optional().members({
      checkReport: schema.boolean.optional(),
      salesStatisticSource: schema.enum.optional(Object.values(SalesStatisticSource)),
      busInactiveTimeout: schema.number.optional([rules.unsigned()]),
      mainMode: schema.enum.optional(Object.values(MainMode)),
      clientEnable: schema.enum.optional(Object.values(ClientEnable)),
      vmcAuditPortEnable: schema.boolean.optional(),
      vmcAuditPort: schema.enum.optional([0, 2, 3]),
      vmcAuditBaudRate: schema.enum.optional([1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200]),
      vmcAuditProtocol: schema.enum.optional(Object.values(VMCAuditProtocol)),
      scaleFactor: schema.number.optional([rules.range(1, 255)]),
      decimalPlacesCash: schema.number.optional([rules.range(0, 4)]),
      decimalPlacesCashless: schema.number.optional([rules.range(0, 4)]),
      acquiringShiftCloseTime: schema.string.optional({}, [
        rules.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      ]), // HH:mm
      acquiringShiftClosePeriod: schema.number.optional([rules.range(0, 365)]),
      currencyCashless: schema.number.optional([rules.unsigned()]),
      timezone: schema.number.optional([rules.range(-12, 14)]),
      keypadDirection: schema.enum.optional(Object.values(KeypadDirection)),
      timeoutVendingInProcess: schema.number.optional([rules.unsigned()]),
      timeoutCancelButtonWhileVending: schema.number.optional([rules.unsigned()]),
      qrCodeMode: schema.number.optional([rules.unsigned()]),
      updateAcquiringConfigAfterShiftClose: schema.boolean.optional(),
      loadWorkKeysAfterShiftClose: schema.boolean.optional(),
      automatId: schema.number.optional([rules.unsigned()]),
    }),
    automat: schema.object.optional().members({
      name: schema.string.optional({ trim: true }, [rules.maxLength(128)]),
      longitude: schema.string.optional({ trim: true }),
      latitude: schema.string.optional({ trim: true }),
      phone: schema.string.optional({ trim: true }),
      serialNumber: schema.string.optional({ trim: true }),
      inventoryNumber: schema.string.optional({ trim: true }),
      comment: schema.string.optional({ trim: true }),
      place: schema.string.optional({ trim: true }),
      contact: schema.string.optional({ trim: true }),
      shedule: schema.string.optional({ trim: true }),
      address: schema.string.optional({ trim: true }), // jsonStringify
      groupId: schema.number.optional([rules.unsigned()]),
      parentId: schema.number.optional([rules.unsigned()]),
      modelId: schema.number.optional([rules.unsigned()]),
    }),
    createChildren: schema.array.optional().members(
      schema.object.optional().members({
        name: schema.string(),
        modelId: schema.number.optional([rules.unsigned()]),
      })
    ),
    updateChildren: schema.array.optional().members(
      schema.object.optional().members({
        id: schema.number([rules.unsigned()]),
        name: schema.string.optional({ trim: true }),
        modelId: schema.number.optional([rules.unsigned()]),
      })
    ),
    schedule: schema.object.optional().members({
      id: schema.number([rules.unsigned()]),
      weeks: schema.string.optional({ trim: true }), // // jsonStringify
      timeFrom: schema.string.optional({}, [rules.regex(/^([0-1]?[0-9]|2[0-3]):[0-0][0-0]$/)]), // 00:00 - 23:00 step one hour
      timeTo: schema.string.optional({}, [rules.regex(/^([0-1]?[0-9]|2[0-3]):[0-0][0-0]$/)]), // 00:00 - 23:00 step one hour
      period: schema.number.optional([rules.range(1, 24)]),
    }),
    fiscalization: schema.object.optional().members({
      id: schema.number([rules.unsigned()]),
      settlementAddress: schema.string.optional({ trim: true }), // jsonStringify
      settlementPlace: schema.string.optional({ trim: true }),
      automatNumber: schema.string.optional({ trim: true }, [rules.maxLength(20)]),
      operationMode: schema.number.optional([rules.unsigned()]),
      taxReporting: schema.enum.optional(Object.values(TaxReporting)),
      taxationSystem: schema.number.optional([rules.unsigned()]),
    }),
    modePose: schema.object.optional().members({
      id: schema.number([rules.unsigned()]),
      posMode: schema.enum.optional(Object.values(PosMode)),
      posPort: schema.number.optional([rules.range(1, 3)]),
    }),
    modePulse: schema.object.optional().members({
      id: schema.number([rules.unsigned()]),
      outputAPulseCost: schema.number.optional([rules.unsigned()]),
      outputBPulseCost: schema.number.optional([rules.unsigned()]),
      outputCPulseCost: schema.number.optional([rules.unsigned()]),
      outputAPulsePeriodMsec: schema.number.optional([rules.unsigned()]),
      outputBPulsePeriodMsec: schema.number.optional([rules.unsigned()]),
      outputCPulsePeriodMsec: schema.number.optional([rules.unsigned()]),
      outputAPulseDurationMsec: schema.number.optional([rules.unsigned()]),
      outputBPulseDurationMsec: schema.number.optional([rules.unsigned()]),
      outputCPulseDurationMsec: schema.number.optional([rules.unsigned()]),
      outputAPulseActive: schema.number.optional([rules.unsigned()]),
      outputBPulseActive: schema.number.optional([rules.unsigned()]),
      outputCPulseActive: schema.number.optional([rules.unsigned()]),
      inputAPulseCost: schema.number.optional([rules.unsigned()]),
      inputBPulseCost: schema.number.optional([rules.unsigned()]),
      inputAPulseMinDurationMsec: schema.number.optional([rules.unsigned()]),
      inputBPulseMinDurationMsec: schema.number.optional([rules.unsigned()]),
      inputAPulseMaxDurationMsec: schema.number.optional([rules.unsigned()]),
      inputBPulseMaxDurationMsec: schema.number.optional([rules.unsigned()]),
      inputAPulseActive: schema.number.optional([rules.unsigned()]),
      inputBPulseActive: schema.number.optional([rules.unsigned()]),
      inhibitInputActive: schema.number.optional([rules.unsigned()]),
      inhibitInputDurationMsec: schema.number.optional([rules.unsigned()]),
      inhibitAOutputActive: schema.number.optional([rules.unsigned()]),
      inhibitBOutputActive: schema.number.optional([rules.unsigned()]),
      inhibitOutputInverse: schema.boolean.optional(),
      vendServicePageText: schema.string.optional({ trim: true }),
      paidCashButton: schema.boolean.optional(),
      choiceStepButton: schema.boolean.optional(),
      pulseServicePhone: schema.string.optional({ trim: true }),
      fixedAmountSelectionScreenTimeoutSec: schema.number.optional([rules.unsigned()]),
      customAmountSelectionScreenTimeoutSec: schema.number.optional([rules.unsigned()]),
      unitSelectionScreenTimeoutSec: schema.number.optional([rules.unsigned()]),
      paymentConfirmationScreenTimeoutSec: schema.number.optional([rules.unsigned()]),
      showQrCodeScreenTimeoutSec: schema.number.optional([rules.unsigned()]),
      finalScreenTimeoutSec: schema.number.optional([rules.unsigned()]),
    }),
    modeMdb: schema.object.optional().members({
      id: schema.number([rules.unsigned()]),
      cashlessLevel: schema.number.optional([rules.range(1, 3)]),
      cashlessAddress: schema.enum.optional([0x10, 0x60]),
      shiftItemId: schema.number.optional([rules.unsigned()]),
      sessionFunds: schema.number.optional([rules.unsigned()]),
    }),
    modeMdbExe: schema.object.optional().members({
      id: schema.number([rules.unsigned()]),
      ccAuditPortEnable: schema.boolean.optional(),
      ccAuditPort: schema.enum.optional([0, 2, 3]),
      ccAuditBaudRate: schema.enum.optional([1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200]),
      ccAuditProtocol: schema.enum.optional(Object.values(CCAuditProtocol)),
      sessionFunds: schema.number.optional([rules.unsigned()]),
      cashlessLevel: schema.number.optional([rules.range(1, 3)]),
      cashlessAddress: schema.enum.optional([0x10, 0x60]),
    }),
    modeExeMaster: schema.object.optional().members({
      id: schema.number([rules.unsigned()]),
      billValidatorUsed: schema.boolean.optional(),
      coinChangerUsed: schema.boolean.optional(),
      cashless1Used: schema.boolean.optional(),
      cashless2Used: schema.boolean.optional(),
      cashCreditMax: schema.number.optional([rules.unsigned()]),
      cashCreditTimeout: schema.number.optional([rules.unsigned()]),
      billTypeAccepted: schema.string.optional({ trim: true }), // jsonStringify
      multiVend: schema.boolean.optional(),
      payoutAlgorithmOfChanger: schema.boolean.optional(),
      payoutWithoutPurchase: schema.boolean.optional(),
      lowChangeThreshold: schema.number.optional([rules.unsigned()]),
      inhibitBillValidatorInLowChange: schema.boolean.optional(),
      denyCashCreditExchange: schema.boolean.optional(),
      autorefund: schema.boolean.optional(),
      pilferorMode: schema.boolean.optional(),
      creditLimit: schema.number.optional([rules.unsigned()]),
    }),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {}
}
