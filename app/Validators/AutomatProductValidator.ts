import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AutomatPoductValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */

  public product = {
    automatPrice: schema.number([rules.unsigned()]),
    maxValue: schema.number([rules.unsigned()]),
    balance: schema.number([rules.unsigned()]),
    slot: schema.number([rules.unsigned()]),
  }

  public schema = schema.create({
    automatId: schema.number([rules.unsigned()]),
    create: schema.array().members(
      schema.object.optional().members({
        ...this.product,
        productId: schema.number.optional([rules.unsigned()]),
      })
    ),
    update: schema
      .array()
      .members(
        schema.object.optional().members({ id: schema.number([rules.unsigned()]), ...this.product })
      ),
    updateReserviors: schema.array.optional().members(
      schema.object().members({
        id: schema.number([rules.unsigned()]),
        balance: schema.number([rules.unsigned()]),
      })
    ),
    remove: schema.array().members(schema.number.optional([rules.unsigned()])),
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

export class FullLoadAutomatsProductsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    automatsId: schema.array().members(schema.number([rules.unsigned()])),
    automatProducts: schema.array.optional().members(
      schema.object().members({
        id: schema.number([rules.unsigned()]),
        balance: schema.number([rules.unsigned()]),
        automatId: schema.number([rules.unsigned()]),
      })
    ),
    reserviors: schema.array.optional().members(
      schema.object().members({
        id: schema.number([rules.unsigned()]),
        balance: schema.number([rules.unsigned()]),
      })
    ),
  })

  public messages = {}
}
