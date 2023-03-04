import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ServiceMenuPins extends BaseSchema {
  protected tableName = 'service_menu_pins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('pin')
      table.string('pin_hash')

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
