import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class CreateSalesValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    sales: schema.array().members(
      schema.object().members({
        productName: schema.string({ trim: true }, [rules.maxLength(128)]),
        automatName: schema.string({ trim: true }, [rules.maxLength(128)]),
        groupName: schema.string.optional({ trim: true }, [rules.maxLength(128)]),
        price: schema.number([rules.unsigned(), rules.range(1, 999999.99)]),
        quantity: schema.number([rules.unsigned()]),
        automatProductId: schema.number([rules.unsigned()]),
        groupId: schema.number.optional([rules.unsigned()]),
        automatId: schema.number([rules.unsigned()]),
      })
    ),
  })
}
