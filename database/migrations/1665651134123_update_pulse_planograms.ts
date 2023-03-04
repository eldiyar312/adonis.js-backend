import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PulsePlanograms extends BaseSchema {
  protected tableName = 'pulse_planograms'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      //default "Не облагается"
      table.tinyint('tax').unsigned().defaultTo(6)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('tax')
    })
  }
}
