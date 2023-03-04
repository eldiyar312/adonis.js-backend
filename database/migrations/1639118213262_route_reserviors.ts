import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RouteReserviors extends BaseSchema {
  protected tableName = 'route_reserviors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.double('issued')
      table.double('returned')
      table.double('write_off')
      table.double('added')
      table.double('estimated_balance')
      table.integer('route_id').unsigned().references('routes.id').onDelete('CASCADE')
      table
        .integer('route_automat_id')
        .unsigned()
        .references('route_automats.id')
        .onDelete('CASCADE')
      table.integer('reservior_id').unsigned().references('reserviors.id').onDelete('CASCADE')

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
