import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserRole } from '../../constants'

export class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.maxLength(128)]),
    roleId: schema.enum(Object.values(UserRole)), // 1=admin, 2=operator
    name: schema.string.optional({ trim: true }, [rules.maxLength(128)]),
    phone: schema.string.optional({ trim: true }, [rules.maxLength(128)]),
  })
}

export class InvitationConfirmValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string({ trim: true }, [rules.minLength(4), rules.maxLength(255)]),
  })
}

export class UserUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    userId: schema.number([rules.unsigned()]),
    roleId: schema.enum(Object.values(UserRole)), // 1=admin, 2=operator
    name: schema.string.optional({ trim: true }, [rules.maxLength(128)]),
    phone: schema.string.optional({ trim: true }, [rules.maxLength(128)]),
  })
}

export class UsersDeleteValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    usersId: schema.array().members(schema.number()),
  })
}
