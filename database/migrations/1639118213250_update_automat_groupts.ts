import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AutomatGroups extends BaseSchema {
  protected tableName = 'automat_groups'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('orange_data_group').defaultTo('Vend')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('orange_data_group')
    })
  }
}
