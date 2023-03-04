import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RouteStatuses } from '../../constants'

export default class RouteValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({ trim: true }, [rules.maxLength(40)]),
    status: schema.enum(Object.values(RouteStatuses)),
    operatorId: schema.number.optional(),
    startDate: schema.string.optional({ trim: true }),
    automatsId: schema.array.optional().members(schema.number()),
  })
}

export class RouteUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({ trim: true }, [rules.maxLength(40)]),
    status: schema.enum.optional(Object.values(RouteStatuses)),
    operatorId: schema.number.optional(),
    startDate: schema.string.optional({ trim: true }),
    addAutomatsId: schema.array().members(schema.number.optional()),
    deleteAutomatsId: schema.array().members(schema.number.optional()),
  })
}

export class RouteAutomatsPositionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    automatsId: schema.array().members(schema.number([rules.unsigned()])),
    positions: schema.array().members(schema.number([rules.unsigned()])),
  })
}

export class RouteAutomatCommentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    comment: schema.string({ trim: true }),
  })
}

export class RouteCommentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    comment: schema.string({ trim: true }),
  })
}

export class UpdateRouteAutomatProductsReserviorsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    reserviors: schema.array.optional().members(
      schema.object().members({
        id: schema.number(),
        estimatedBalance: schema.number(),
        added: schema.number(),
      })
    ),
    products: schema.array.optional().members(
      schema.object().members({
        id: schema.number(),
        estimatedBalance: schema.number([rules.unsigned()]),
        added: schema.number([rules.unsigned()]),
      })
    ),
  })
}

export class ChangeRoutesStatusValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    routesId: schema.array().members(schema.number()),
    status: schema.enum(Object.values(RouteStatuses)),
  })
}

export class CopyRoutesValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    routesId: schema.array().members(schema.number([rules.unsigned()])),
  })
}

export class RouteAutomatsFullLoadValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    routeAutomatsId: schema.array().members(schema.number([rules.unsigned()])),
  })
}
