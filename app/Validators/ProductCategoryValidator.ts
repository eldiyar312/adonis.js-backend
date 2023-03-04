import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class ProductCategoryValidator {
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
    defaultSubject: schema.enum.optional([
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
    defaultTax: schema.enum.optional(['1', '2', '3', '4', '5', '6']),
    defaultUnit: schema.enum.optional([
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
    ]),
    parentId: schema.number.optional([rules.unsigned()]),
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
export class ProductCategoriesValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    categories: schema.array().members(
      schema.object().members({
        name: schema.string({ trim: true }, [rules.maxLength(128)]),
        defaultSubject: schema.enum.optional([
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
        defaultTax: schema.enum.optional(['1', '2', '3', '4', '5', '6']),
        defaultUnit: schema.enum.optional([
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
        ]),
        parentId: schema.number.optional([rules.unsigned()]),
      })
    ),
  })

  public messages = {}
}

export class UpdateProductCategoryValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(128)]),
    defaultSubject: schema.enum.optional([
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
    defaultTax: schema.enum.optional(['1', '2', '3', '4', '5', '6']),
    defaultUnit: schema.enum.optional([
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
    ]),
    parentId: schema.number.optional([rules.unsigned()]),
  })

  public messages = {}
}
