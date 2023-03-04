import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ServiceMenuStatusToCube } from '../../constants'

export class ServiceMenuValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    status: schema.enum(Object.values(ServiceMenuStatusToCube)),
    devicesId: schema.array().members(schema.number([rules.unsigned()])),
  })
}

export class ServiceMenuPinValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    devicesId: schema.array().members(schema.number([rules.unsigned()])),
  })
}

export class UpdateServiceMenuPinValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    devicesId: schema.array().members(schema.number([rules.unsigned()])),
    pin: schema.string([rules.maxLength(6), rules.minLength(0)]),
  })
}

export class UpdateSimNumberValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    numbers: schema.array().members(
      schema.object().members({
        simNumber: schema.string.optional({ trim: true }, [rules.maxLength(128)]),
        comment: schema.string.optional({ trim: true }),
        deviceId: schema.number([rules.unsigned()]),
      })
    ),
  })
}

export class CreateDeviceValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    deviceName: schema.string({ trim: true }, [rules.maxLength(128)]),
    activationDate: schema.date.optional(),
    serialNumber: schema.string.optional({ trim: true }, [rules.maxLength(128)]),
    comment: schema.string.optional({ trim: true }),
    simNumber: schema.string.optional({ trim: true }, [rules.maxLength(128)]),
    automatId: schema.number([rules.unsigned()]),
  })
}
