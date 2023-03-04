import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class CreateDeviceValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    deviceName: schema.string(),
    accountId: schema.number([rules.unsigned()]),
    pin: schema.string([rules.maxLength(6)]),
  })
}

export class DeleteDeviceValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    deviceName: schema.string(),
    pin: schema.string([rules.maxLength(6)]),
  })
}
