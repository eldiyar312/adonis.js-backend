import { LucidRow } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export const softDelete = async (row: LucidRow, column = 'deletedAt') => {
  if (row.$attributes.hasOwnProperty(column)) {
    console.log(row, column)
    row[column] = DateTime.local()
  }
  return row.save()
}
