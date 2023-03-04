import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IngredientValidator {
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
  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(128)]),
    unit: schema.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
    price: schema.number([rules.unsigned(), rules.range(1, 999999.99)]),
    sku: schema.string.optional({ trim: true }, [rules.maxLength(64)]),
    tax: schema.enum(['1', '2', '3', '4', '5', '6']),
    weight: schema.number([rules.unsigned(), rules.range(1, 9999999)]),
    img: schema.string.optional(),
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

export class DeleteIngredientValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    ingredients: schema.array().members(
      schema.object().members({
        id: schema.number(),
        recipeId: schema.number.optional(),
      })
    ),
  })

  public messages = {}
}

export class CreateIngredientsBulkValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    ingredients: schema.array().members(
      schema.object().members({
        name: schema.string({ trim: true }, [rules.maxLength(128)]),
        unit: schema.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
        price: schema.number.optional([rules.unsigned(), rules.range(1, 999999.99)]),
        sku: schema.string.optional({ trim: true }, [rules.maxLength(64)]),
        tax: schema.enum(['1', '2', '3', '4', '5', '6']),
        weight: schema.number.optional([rules.unsigned(), rules.range(1, 9999999)]),
        img: schema.string.optional(),
      })
    ),
  })

  public messages = {}
}
