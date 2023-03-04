import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  beforeSave,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Role from './Role'
import Account from './Account'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
  @column()
  public email: string
  @column()
  public phone: string | null
  @column({ serializeAs: null })
  public password: string
  @column()
  public active: boolean
  @column({ serializeAs: null })
  public remember_me_token: string | null

  @column()
  public inviterId: number
  @column()
  public roleId: number
  @column()
  public accountId: number

  @belongsTo(() => Role)
  public Role: BelongsTo<typeof Role>
  @belongsTo(() => Account)
  public Account: BelongsTo<typeof Account>
  @belongsTo(() => Account)
  public User: BelongsTo<typeof User>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeFind()
  public static ignoreDeleted(query) {
    query.whereNull('deleted_at')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
