import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class ApplicationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    bankId: schema.number([rules.unsigned()]),
  })
}

export class UpdateApplicationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    form: schema.string({ trim: true }),
    // values: schema.string() Array<object> || object
    step: schema.number([rules.unsigned()]),
  })
}

export class UpdateApplicationEmailValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(255)]),
  })
}
