import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Receipts extends BaseSchema {
  protected tableName = 'receipts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary
      table.integer('type')
      table.jsonb('content')
      table.double('amount')
      table.string('calculation_address')
      table.string('calculation_place')
      table.bigInteger('operation_number')
      table.string('fs_number')
      table.string('device_sn')
      table.string('device_rn')
      table.string('ofd_name')
      table.string('ofd_website')
      table.string('ofd_inn')
      table.string('fns_website')
      table.string('document_index')
      table.timestamp('processed_at', { useTz: false })
      table.timestamp('processed_at_tz')
      table.double('change')
      table.string('fp')
      table.string('company_inn')
      table.string('company_name')
      table.integer('document_number')
      table.integer('return_check_id')
      table.integer('operation_mode')
      table.integer('fiscalization_status')
      table.string('fiscalization_error')
      table.boolean('is_non_fiscal')
      table.string('callback_url')
      table.integer('delivered_cube').defaultTo(0)
      table.integer('account_id').unsigned().references('accounts.id').onDelete('CASCADE')
      table.integer('automat_id').unsigned().references('automats.id').onDelete('CASCADE')
      table.integer('device_id').unsigned().references('devices.id').onDelete('CASCADE')

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
