import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { OrganizationsPartnerStatus } from '../../constants'

export default class Organizations extends BaseSchema {
  protected tableName = 'organizations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.date('registration_date')
      table.string('inn')
      table.string('ogrn')
      table.string('okpo')
      table.jsonb('legal_address')
      table.jsonb('real_address')
      table.string('legal_office')
      table.string('real_office')
      table.string('fio')
      table.string('phone')
      table.string('email')
      table.string('authority')
      table.jsonb('director_address')
      table.string('authority_document')
      table.date('authority_date')
      table.string('authority_number')
      table.date('authority_valid_from')
      table.date('authority_valid_until')
      table.enum('partner_status', Object.values(OrganizationsPartnerStatus))
      table.date('birth_date')
      table.string('kpp')
      table.integer('tax_system')
      table.string('trade_name')
      table.jsonb('dadata')
      table.string('opf')
      table.string('passport_serial')
      table.string('passport_number')
      table.string('passport_authority')
      table.string('english_name')
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
