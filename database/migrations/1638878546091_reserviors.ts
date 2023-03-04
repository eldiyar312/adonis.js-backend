import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Reserviors extends BaseSchema {
  protected tableName = 'reserviors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.integer('number')
      table.double('max_volume')
      table.string('unit')
      table.double('balance')
      table.integer('automat_id').unsigned().references('automats.id').onDelete('CASCADE')
      table.integer('account_id').unsigned().references('accounts.id').onDelete('CASCADE')
      table.integer('ingredient_id').unsigned().references('ingredients.id').onDelete('CASCADE')

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
