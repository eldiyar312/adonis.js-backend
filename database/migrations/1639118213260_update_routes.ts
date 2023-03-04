import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Routes extends BaseSchema {
  protected tableName = 'routes'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('automatic_done').defaultTo(false)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('automatic_done')
    })
  }
}
