import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RouteAutomats extends BaseSchema {
  protected tableName = 'route_automats'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('position')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('position')
    })
  }
}
