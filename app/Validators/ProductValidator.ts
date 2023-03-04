import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class ProductValidator {
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
    sku: schema.string.optional({ trim: true }, [rules.maxLength(64)]),
    unit: schema.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
    price: schema.number([rules.unsigned(), rules.range(1, 999999.99)]),
    tax: schema.enum(['1', '2', '3', '4', '5', '6']),
    subject: schema.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']),
    paymentMethodType: schema.number([rules.unsigned(), rules.range(1, 7)]),
    img: schema.string.optional(),
    productCategoryId: schema.number(),
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

export class DeleteProductRecipesValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    productsId: schema.array().members(schema.number.optional()),
  })

  public messages = {}
}

export class MoveProductsRecipesValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    productsId: schema.array().members(schema.number()),
    productCategoryId: schema.number(),
  })

  public messages = {}
}

export class CreateProductsBulkValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    products: schema.array().members(
      schema.object().members({
        name: schema.string({ trim: true }, [rules.maxLength(128)]),
        sku: schema.string.optional(),
        unit: schema.enum.optional(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
        price: schema.number.optional([rules.unsigned(), rules.range(1, 999999.99)]),
        tax: schema.enum.optional(['1', '2', '3', '4', '5', '6']),
        subject: schema.enum.optional([
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
        ]),
        img: schema.string.optional(),
        paymentMethodType: schema.number.optional([rules.unsigned(), rules.range(1, 7)]),
        productCategoryId: schema.number.optional(),
      })
    ),
  })

  public messages = {}
}

export class ReserviorValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    reserviors: schema.array().members(
      schema.object().members({
        id: schema.number(),
        number: schema.number(),
        maxVolume: schema.number([rules.unsigned(), rules.range(1, 9999999)]),
      })
    ),
  })

  public messages = {}
}

export class AutomatProductWeightValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    ingredients: schema.array().members(
      schema.object().members({
        weight: schema.number([rules.unsigned(), rules.range(1, 9999999)]),
        automatId: schema.number(),
        automatProductId: schema.number(),
        ingredientId: schema.number(),
      })
    ),
  })

  public messages = {}
}
