import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class CreateRouteReportValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    routeReports: schema.array().members(
      schema.object().members({
        name: schema.string({ trim: true }, [rules.maxLength(128)]),
        userName: schema.string({ trim: true }, [rules.maxLength(128)]),
        startDate: schema.string({ trim: true }),
        endDate: schema.string({ trim: true }),
        period: schema.string({ trim: true }),
        userId: schema.number(),
      })
    ),
  })
}
