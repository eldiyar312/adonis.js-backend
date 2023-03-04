import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OrganizationDocuments extends BaseSchema {
  protected tableName = 'organization_documents'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('type').notNullable()
      table.string('client_sign')
      table.integer('account_id').unsigned().references('accounts.id').onDelete('CASCADE')
      table.integer('application_id').unsigned().references('applications.id').onDelete('CASCADE')
      table.integer('file_id').unsigned().references('files.id').onDelete('CASCADE')

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
