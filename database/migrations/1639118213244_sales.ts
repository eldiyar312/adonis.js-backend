import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Sales extends BaseSchema {
  protected tableName = 'sales'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('product_name')
      table.string('automat_name')
      table.string('group_name')
      table.double('price')
      table.integer('quantity')
      table
        .integer('automat_product_id')
        .unsigned()
        .references('automat_products.id')
        .onDelete('CASCADE')
      table
        .integer('pulse_planogram_id')
        .unsigned()
        .references('pulse_planograms.id')
        .onDelete('CASCADE')
      table.integer('automat_id').unsigned().references('automats.id').onDelete('CASCADE')
      table.integer('group_id').unsigned().references('automat_groups.id').onDelete('CASCADE')
      table.integer('account_id').unsigned().references('accounts.id').onDelete('CASCADE')

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
