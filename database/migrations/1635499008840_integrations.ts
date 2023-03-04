import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Integrations extends BaseSchema {
  protected tableName = 'integrations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('public_key', 2048).notNullable()
      table.string('private_key', 2048).notNullable()
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
