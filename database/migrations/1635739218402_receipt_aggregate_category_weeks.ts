import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ReceiptAggregateCategoryWeeks extends BaseSchema {
  protected tableName = 'receipt_aggregate_category_weeks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('count')
      table.integer('quantity')
      table.double('sum_in')
      table.double('sum_out')
      table.timestamp('begin').notNullable()
      table.timestamp('end').notNullable()
      table.integer('account_id').unsigned().references('accounts.id').onDelete('CASCADE')
      table.integer('automat_id').unsigned().references('automats.id').onDelete('CASCADE')
      table.integer('device_id').unsigned().references('devices.id').onDelete('CASCADE')
      table
        .integer('category_id')
        .unsigned()
        .references('product_categories.id')
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
