import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Applications extends BaseSchema {
  protected tableName = 'applications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.jsonb('organization')
      table.jsonb('trade_point')
      table.jsonb('money_back')
      table.jsonb('money_turnover')
      table.jsonb('beneficiary')
      table.jsonb('additional_documents')
      table.jsonb('representer')
      table.integer('finished_step')
      table.string('service')
      table.string('client')
      table.string('login')
      table.string('password')
      table.string('processed_at')
      table.string('need_documents')
      table.integer('need_documents_count')
      table.timestamp('published_at')
      table.string('contract')
      table.string('email')
      table.integer('bank_id').unsigned().references('banks.id').onDelete('CASCADE')
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
