import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('email')
      table.string('phone')
      table.string('password').nullable()
      table.boolean('active').notNullable().defaultTo(false)
      table.string('remember_me_token')
      table.integer('role_id').unsigned().references('roles.id').notNullable().onDelete('CASCADE')
      table
        .integer('account_id')
        .unsigned()
        .references('accounts.id')
        .notNullable()
        .onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: false })
      table.timestamp('updated_at', { useTz: false })
      table.timestamp('deleted_at', { useTz: false })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
