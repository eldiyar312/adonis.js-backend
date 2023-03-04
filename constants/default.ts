export const DFiscalization = {
  taxationSystem: 0,
  settlementAddress: JSON.stringify({}),
  settlementPlace: '',
  automatNumber: '',
  operationMode: 0,
  taxReporting: 0,
}

export const DSchedule = {
  weeks: JSON.stringify(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
  timeFrom: '00:00',
  timeTo: '00:00',
  period: 2,
}

export const DModePose = {
  posMode: 1,
  posPort: 3,
}

export const DModePulse = {
  outputAPulseCost: 1.0,
  outputBPulseCost: 1.0,
  outputCPulseCost: 1.0,
  outputAPulsePeriodMsec: 100,
  outputBPulsePeriodMsec: 100,
  outputCPulsePeriodMsec: 100,
  outputAPulseDurationMsec: 50,
  outputBPulseDurationMsec: 50,
  outputCPulseDurationMsec: 50,
  outputAPulseActive: 0,
  outputBPulseActive: 0,
  outputCPulseActive: 0,
  inputAPulseCost: 1.0,
  inputBPulseCost: 1.0,
  inputAPulseMinDurationMsec: 5,
  inputBPulseMinDurationMsec: 5,
  inputAPulseMaxDurationMsec: 500,
  inputBPulseMaxDurationMsec: 500,
  inputAPulseActive: 0,
  inputBPulseActive: 0,
  inhibitInputActive: 0,
  inhibitInputDurationMsec: 700,
  inhibitAOutputActive: 0,
  inhibitBOutputActive: 0,
  inhibitOutputInverse: false,
  vendServicePageText: '',
  paidCashButton: false,
  choiceStepButton: false,
  pulseServicePhone: '+7 (999) 999-99-99',
  fixedAmountSelectionScreenTimeoutSec: 60,
  customAmountSelectionScreenTimeoutSec: 15,
  unitSelectionScreenTimeoutSec: 15,
  paymentConfirmationScreenTimeoutSec: 15,
  showQrCodeScreenTimeoutSec: 15,
  finalScreenTimeoutSec: 15,
}

export const DModeExeMaster = {
  billValidatorUsed: true,
  coinChangerUsed: true,
  cashless1Used: false,
  cashless2Used: false,
  cashCreditMax: 3550,
  cashCreditTimeout: 360,
  billTypeAccepted: JSON.stringify([1000, 5000, 10000, 20000]),
  multiVend: true,
  payoutAlgorithmOfChanger: false,
  payoutWithoutPurchase: false,
  lowChangeThreshold: 2000,
  inhibitBillValidatorInLowChange: true,
  denyCashCreditExchange: false,
  autorefund: false,
  pilferorMode: false,
  creditLimit: 0,
}

export const DModeMdb = {
  cashlessLevel: 1,
  cashlessAddress: 0x10,
  shiftItemId: 0,
  sessionFunds: 0xffff,
}

export const DModeMdbExe = {
  ccAuditPortEnable: true,
  ccAuditPort: 0,
  ccAuditBaudRate: 2400,
  ccAuditProtocol: 0,
  sessionFunds: 0xffff,
  cashlessLevel: 1,
  cashlessAddress: 0x10,
}

export const DAutomatSetting = {
  checkReport: true,
  salesStatisticSource: 0,
  busInactiveTimeout: 180,
  mainMode: 1,
  clientEnable: 0,
  vmcAuditPortEnable: false,
  vmcAuditPort: 3,
  vmcAuditBaudRate: 2400,
  vmcAuditProtocol: 0,
  scaleFactor: 1,
  decimalPlacesCash: 2,
  decimalPlacesCashless: 2,
  acquiringShiftCloseTime: '12:00',
  acquiringShiftClosePeriod: 0,
  currencyCashless: 643,
  timezone: 3,
  keypadDirection: 0,
  timeoutVendingInProcess: 360,
  timeoutCancelButtonWhileVending: 60,
  qrCodeMode: 0,
  updateAcquiringConfigAfterShiftClose: true,
  loadWorkKeysAfterShiftClose: false,
}

export const DAutomatGroup = {
  name: 'Мои автоматы',
}
