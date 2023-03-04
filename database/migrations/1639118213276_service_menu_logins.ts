import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ServiceMenuLogins extends BaseSchema {
  protected tableName = 'service_menu_logins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('status') // ServiceMenuStatus
      table.integer('delivered_cube').defaultTo(0)
      table.integer('device_id').unsigned().references('devices.id').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')

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
