import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TAX_RATES } from '../../constants'

const planogram = {
  buttonIndex: schema.number(),
  pulseIndexExit: schema.number(),
  productName: schema.string({ trim: true }, [rules.maxLength(128)]),
  count: schema.number([rules.unsigned()]),
  unitPrice: schema.number([rules.unsigned()]),
  pulseUnitId: schema.number(),
  automatId: schema.number(),
  tax: schema.number([
    rules.range(+TAX_RATES()[0].value, +TAX_RATES()[+TAX_RATES().length - 1].value),
  ]),
}

export class CreatePulsePlanogramValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    planograms: schema.array().members(schema.object().members(planogram)),
  })

  public messages = {}
}

export class UpdatePulsePlanogramValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    planograms: schema.array().members(
      schema.object().members({
        id: schema.number(),
        ...planogram,
      })
    ),
  })

  public messages = {}
}

export class RemovePulsePlanogramValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    planograms: schema.array().members(schema.number()),
  })

  public messages = {}
}

export class CreatePulsePlanogramUnitValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    units: schema.array().members(
      schema.object().members({
        name: schema.string(),
        choiceStep: schema.number([rules.unsigned()]),
      })
    ),
  })

  public messages = {}
}

export class UpdatePulsePlanogramUnitValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    units: schema.array().members(
      schema.object().members({
        id: schema.number(),
        name: schema.string.optional({ trim: true }, [rules.maxLength(128)]),
        choiceStep: schema.number.optional([rules.unsigned()]),
      })
    ),
  })

  public messages = {}
}
