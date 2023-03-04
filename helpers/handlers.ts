import { ModelObject } from '@ioc:Adonis/Lucid/Orm'

/**
 * Суммируем повторяющиеся (резервуары | продукты) в массиве
 * @param {Array} products - массив для проверки
 * @returns {Array | null} - массив с уникальными значениями или null
 */
export const sumProductsReserviorsValues = (products: ModelObject[] | null) => {
  if (!products) return products
  const data = {}
  for (const product of products) {
    if (data[product.id]) {
      data[product.id].max_value += product?.max_value
      data[product.id].max_volume += product?.max_volume
      data[product.id].balance += product?.balance
      data[product.id].added += product?.added
    } else {
      data[product.id] = product
    }
  }

  return Object.values(data)
}
