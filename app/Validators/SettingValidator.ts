import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OrganizationsPartnerStatus } from '../../constants'

export default class SettingValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "numberegrity" of data.
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
    profile: schema.object.optional().members({
      name: schema.string.optional({ trim: true }, [rules.maxLength(128)]),
      email: schema.string.optional({ trim: true }, [rules.maxLength(128)]),
    }),
    password: schema.object.optional().members({
      oldPassword: schema.string({ trim: true }, [rules.minLength(4), rules.maxLength(255)]),
      newPassword: schema.string({ trim: true }, [rules.minLength(4), rules.maxLength(255)]),
    }),
    organization: schema.object.optional().members({
      name: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(128)]),
      registrationDate: schema.date.nullableAndOptional(),
      inn: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(128)]),
      ogrn: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(128)]),
      okpo: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(128)]),
      legalAddress: schema.string.nullableAndOptional({ trim: true }), // jsonb
      realAddress: schema.string.nullableAndOptional({ trim: true }), // jsonb
      legalOffice: schema.string.nullableAndOptional({ trim: true }),
      realOffice: schema.string.nullableAndOptional({ trim: true }),
      fio: schema.string.nullableAndOptional({ trim: true }),
      phone: schema.string.nullableAndOptional({ trim: true }),
      email: schema.string.nullableAndOptional({ trim: true }),
      authority: schema.string.nullableAndOptional({ trim: true }),
      directorAddress: schema.string.nullableAndOptional({ trim: true }), // jsonb
      authorityDocument: schema.string.nullableAndOptional({ trim: true }),
      authorityDate: schema.date.nullableAndOptional(),
      authorityNumber: schema.string.nullableAndOptional({ trim: true }),
      authorityValidFrom: schema.date.nullableAndOptional(),
      authorityValidUntil: schema.date.nullableAndOptional(),
      partnerStatus: schema.enum.nullableAndOptional(Object.values(OrganizationsPartnerStatus)),
      birthDate: schema.date.nullableAndOptional(),
      kpp: schema.string.nullableAndOptional({ trim: true }),
      taxSystem: schema.number.nullableAndOptional([rules.unsigned()]),
      tradeName: schema.string.nullableAndOptional({ trim: true }),
      dadata: schema.string.nullableAndOptional({ trim: true }), // jsonb
      opf: schema.string.nullableAndOptional({ trim: true }),
      passportSerial: schema.string.nullableAndOptional({ trim: true }),
      passportNumber: schema.string.nullableAndOptional({ trim: true }),
      passportAuthority: schema.string.nullableAndOptional({ trim: true }),
      englishName: schema.string.nullableAndOptional({ trim: true }),
      accountId: schema.number.nullableAndOptional([rules.unsigned()]),
    }),
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
  public messages = {
    'email': 'не валидный email',
    'password': 'не валидный password',
  }
}
