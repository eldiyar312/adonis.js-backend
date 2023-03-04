import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserAutomatPins extends BaseSchema {
  protected tableName = 'user_automat_pins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('automat_id').unsigned().references('automats.id').onDelete('CASCADE')
      table
        .integer('service_menu_pin_id')
        .unsigned()
        .references('service_menu_pins.id')
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
