import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RouteReports extends BaseSchema {
  protected tableName = 'route_reports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('user_name')
      table.timestamp('start_date')
      table.timestamp('end_date')
      table.string('period')
      table.jsonb('automats')
      table.jsonb('service_products')
      table.integer('account_id').unsigned().references('accounts.id').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('route_id').unsigned().references('routes.id').onDelete('CASCADE')

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
