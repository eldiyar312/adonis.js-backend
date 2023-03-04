import Database from '@ioc:Adonis/Lucid/Database'
import AutomatProduct from 'App/Models/AutomatProduct'
import Ingredient from 'App/Models/Ingredient'
import Product from 'App/Models/Product'
import AutomatProductWeight from 'App/Models/AutomatProductWeight'
import Reservior from 'App/Models/Reservior'
import AutomatProductValidator, {
  FullLoadAutomatsProductsValidator,
} from 'App/Validators/AutomatProductValidator'
import { AutomatProductWeightValidator } from 'App/Validators/ProductValidator'
import { IMAGE_NAME, Message, RouteStatuses } from '../../../../constants'
import { imgOpen } from '../../../../helpers/fileSys'
import logger, { createLogMessage } from '../../../../libs/logger'
import Route from 'App/Models/Route'
import { DateTime } from 'luxon'
import {
  arrayUnique,
  removeArrSameItems,
  removeArrSameObjects,
  strToBool,
} from '../../../../helpers/functions'
import { sumProductsReserviorsValues } from '../../../../helpers/handlers'
import RouteAutomat from 'App/Models/RouteAutomat'
import RouteProduct from 'App/Models/RouteProduct'
import RouteReservior from 'App/Models/RouteReservior'
import { createRouteAutomatsProductsReserviors } from '../routes/routes'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import Automat from 'App/Models/Automat'

export const updateAutomatProduct = async ({ request, response, auth }) => {
  try {
    await request.validate(AutomatProductValidator)

    const { create, update, remove, updateReserviors, automatId } = request.body()

    const automat = await Automat.query()
      .where('id', automatId)
      .andWhere('accountId', auth.user.accountId)
      .first()

    if (!automat) response.badRequest({ message: Message.NO_AUTOMAT })

    let productsCreated: AutomatProduct[] = []
    if (create.length) {
      const productsId = create
        .filter((product) => product.productId)
        .map((product) => product.productId)
        .filter((el, i, arr) => arr.indexOf(el) === i)

      const found = await Product.query()
        .whereIn('id', productsId)
        .andWhere('accountId', auth.user.accountId)

      if (found.length === productsId.length) {
        for (let i = 0; i < create.length; i++) create[i]['automatId'] = automatId
        productsCreated = await AutomatProduct.createMany(create)
      }
    }

    const reserviors = await createReserviorsForAutomatProducts(
      productsCreated,
      automatId,
      auth.user.accountId
    )

    const productsUpdated: AutomatProduct[] = []
    if (update.length) {
      for (let i = 0; i < update.length; i++) {
        const { id, ...product } = update[i]
        let automatProduct = await AutomatProduct.query()
          .where('id', id)
          .andWhere('automatId', automatId)
          .first()
        if (!automatProduct) continue

        automatProduct = await automatProduct.merge({ ...product, automatId }).save()
        productsUpdated.push(automatProduct)
      }
    }

    if (remove.length) {
      const ingredientsId = await Database.from('automat_products as ap')
        .select('ingredients.id')
        .join('composite_products_ingredients as cpi', 'cpi.product_id', '=', 'ap.product_id')
        .join('ingredients', 'ingredients.id', '=', 'cpi.ingredient_id')
        .where('ap.automat_id', automatId)
        .andWhereIn('ap.id', remove)
        .groupBy(['ingredients.id'])

      if (ingredientsId.length) {
        await Reservior.query()
          .whereIn(
            'ingredientId',
            ingredientsId.map((ingredientId) => ingredientId.id)
          )
          .andWhere('automatId', automatId)
          .delete()
      }
      await Database.from('automat_products')
        .whereIn('id', remove)
        .andWhere('automat_id', automatId)
        .update({ deleted_at: new Date().toISOString(), delivered_cube: 0 })
    }

    const updatedReserviors: Reservior[] = []
    if (updateReserviors && updateReserviors.length) {
      for (let i = 0; i < updateReserviors.length; i++) {
        const { id, balance } = updateReserviors[i]
        let reservior = await Reservior.query()
          .where('id', id)
          .andWhere('automatId', automatId)
          .andWhere('accountId', auth.user.accountId)
          .first()
        if (!reservior) continue

        reservior = await reservior.merge({ balance }).save()
        updatedReserviors.push(reservior)
      }
    }

    response.send({ result: { productsCreated, productsUpdated, reserviors, updatedReserviors } })
    logger.info(
      `${auth.user.email} updated automat products`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getAutomatProducts = async ({ request, response, auth }) => {
  try {
    const { automatId } = request.params()

    const { rows: products } = await Database.rawQuery(
      `SELECT ap.*, p.name,
        pc.name as category_name, p.sku, p.unit, p.price, p.tax, p.subject, p.img,
        CASE WHEN p.recipe = true THEN
          jsonb_agg(jsonb_build_object(
            'id', i.id, 'name', i.name, 'unit', i.unit, 'price', i.price, 'sku', i.sku, 'tax', i.tax, 'weight', i.weight, 'img', i.img, 'updated_at', i.updated_at, 'created_at', i.created_at, 'account_id', i.account_id,
            'personal_weight', cpi.weight, 'personal_price', cpi.price
          ))
          ELSE null
        END as ingredients
      FROM products p
        LEFT JOIN composite_products_ingredients cpi on cpi.product_id = p.id
        LEFT JOIN ingredients i on i.id = cpi.ingredient_id
        INNER JOIN automat_products ap on ap.product_id = p.id
        INNER JOIN product_categories pc on pc.id = p.product_category_id
      WHERE p.account_id = :accountId AND ap.automat_id = :automatId AND ap.deleted_at IS NULL
      GROUP BY p.id, ap.id, pc.name
      ORDER BY ap.slot DESC`,
      { accountId: auth.user.accountId, automatId }
    )

    // присваиваем парам weight с таблицы automatProductWeight
    if (products.length) {
      for (let i = 0; i < products.length; i++) {
        const product = products[i]
        if (product.ingredients) {
          let result: AutomatProductWeight[] | ModelObject = await AutomatProductWeight.query()
            .whereIn(
              'ingredient_id',
              product.ingredients.map((i) => i.id)
            )
            .andWhere('automat_id', automatId)
            .andWhere('account_id', auth.user.accountId)
            .andWhere('automat_product_id', product.id)

          result = result.map((e: AutomatProductWeight) => e.serialize())

          for (let y = 0; y < product.ingredients.length; y++) {
            let ingredient = product.ingredients[y]
            ingredient = result.find((e: ModelObject) => e.ingredient_id === ingredient.id)
            if (ingredient) products[i].ingredients[y].weight = ingredient.weight
          }
        }
      }
    }

    if (products.length) {
      products.forEach((product: Product, i: number) => {
        products[i]['img'] = imgOpen(IMAGE_NAME.PRODUCT, product.id)

        if (products[i]['ingredients'] && products[i]['ingredients'].length) {
          products[i]['ingredients'].forEach((ingredient: Ingredient, index: number) => {
            products[i]['ingredients'][index]['img'] = imgOpen(IMAGE_NAME.INGREDIENT, ingredient.id)
          })
        }
      })
    }

    response.send({ result: products })
    logger.info(`${auth.user.email} get automat products`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const setWeight = async ({ request, response, auth }) => {
  try {
    await request.validate(AutomatProductWeightValidator)

    const { ingredients } = request.body()

    const result: AutomatProductWeight[] = []
    for (let i = 0; i < ingredients.length; i++) {
      const body = ingredients[i]
      body['accountId'] = auth.user.accountId
      body?.weight && (body.weight = Math.floor(body.weight))

      const pWeight = await AutomatProductWeight.updateOrCreate(
        {
          automatProductId: body.automatProductId,
          accountId: auth.user.accountId,
          automatId: body.automatId,
          ingredientId: body.ingredientId,
        },
        body
      )
      result.push(pWeight)
    }

    response.send({ result })
    logger.info(`${auth.user.email} set weight`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getAllAutomatProducts = async ({ auth, response, request }) => {
  try {
    const { rows: automats } = await Database.rawQuery(`
      SELECT ap.*, p.name FROM automat_products ap
        JOIN automats a ON a.id = ap.automat_id
        JOIN products p on p.id = ap.product_id
      WHERE a.account_id = ${auth.user.accountId}
    `)

    response.send({ result: automats })
    logger.info(
      `${auth.user.email} get all automat products`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const fullLoadAutomatsProducts = async ({ auth, response, request }) => {
  try {
    await request.validate(FullLoadAutomatsProductsValidator)

    const { automatsId, automatProducts, reserviors } = request.body()

    if (automatsId.length > 1 && (automatProducts || reserviors)) {
      return response.badRequest({
        message: 'Нельзя загружать больше одного автомата, при загрузке товаров',
      })
    }

    if (!arrayUnique(automatsId))
      return response.badRequest({ message: 'Автоматы не должны повторяться' })

    const found = await Automat.query()
      .whereIn('id', automatsId)
      .andWhere('accountId', auth.user.accountId)

    if (found.length !== automatsId.length)
      return response.badRequest({ message: Message.NO_AUTOMATS })

    const result = {}

    const {
      rows: [{ count: routesCount }],
    } = await Database.rawQuery('select count(id)::INTEGER from routes where account_id = ?', [
      auth.user.accountId,
    ])

    const route = await Route.create({
      startDate: DateTime.now().toString(),
      operatorId: auth.user.id,
      adminId: auth.user.id,
      accountId: auth.user.accountId,
      name: 'Маршрут обслуживание №' + (+routesCount + 1),
      status: RouteStatuses.DONE,
      number: +routesCount + 1,
      automaticDone: true,
      dateDone: DateTime.now(),
    })

    let routeAutomat: RouteAutomat | null = null
    // если загружаем товары или резервуары одного автомата
    if (automatProducts || reserviors) {
      let {
        rows: [{ count: routeAutomatsCount }],
      } = await Database.rawQuery(
        'select count(id)::INTEGER from route_automats where route_id = ?',
        [route.id]
      )
      for (let i = 0; i < automatsId.length; i++) {
        const automatId = automatsId[i]
        ++routeAutomatsCount
        routeAutomat = await RouteAutomat.create({
          routeId: route.id,
          automatId,
          position: routeAutomatsCount,
        })
      }
    } else {
      await createRouteAutomatsProductsReserviors(automatsId, route.id, true)
    }

    if (automatProducts) {
      result['automatProducts'] = []
      for (let i = 0; i < automatProducts.length; i++) {
        const { id, balance, automatId } = automatProducts[i]

        const automatProduct = await AutomatProduct.query()
          .where('id', id)
          .andWhere('automatId', automatId)
          .first()
        if (!automatProduct) continue

        await automatProduct
          .merge({
            balance: balance < automatProduct.maxValue ? balance : automatProduct.maxValue,
          })
          .save()
        result['automatProducts'].push(automatProduct)

        await RouteProduct.create({
          routeId: route.id,
          automatProductId: automatProduct.id,
          routeAutomatId: routeAutomat?.id,
        })
      }
    }
    if (reserviors) {
      result['reserviors'] = []
      for (let i = 0; i < reserviors.length; i++) {
        const { id, balance } = reserviors[i]

        const reservior = await Reservior.query()
          .where('id', id)
          .andWhere('accountId', auth.user.accountId)
          .first()
        if (!reservior) continue

        await reservior
          .merge({ balance: balance < reservior.maxVolume ? balance : reservior.maxVolume })
          .save()
        result['reserviors'].push(reservior)

        await RouteReservior.create({
          routeId: route.id,
          reserviorId: reservior.id,
          routeAutomatId: routeAutomat?.id,
        })
      }
    }

    // полная загрузка товаров и резервуаров выбранных автоматов
    if (!automatProducts && !reserviors) {
      const { rows: automatProductsUpdated } = await Database.rawQuery(`
        UPDATE automat_products SET balance = max_value
        WHERE automat_id IN (${automatsId.join(',')})
        RETURNING *
      `)
      result['automatProducts'] = automatProductsUpdated

      const { rows: reserviorsUpdated } = await Database.rawQuery(`
        UPDATE reserviors SET balance = max_volume
        WHERE automat_id IN (${automatsId.join(',')})
        RETURNING *
      `)
      result['reserviors'] = reserviorsUpdated
    }

    response.send({ result })
    logger.info(
      `Полная загрузка для автоматов ${automatsId.join(',')} сделана`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getAutomatsProductsReserviors = async ({ auth, request, response }) => {
  try {
    /**
     * @param {boolean} sumProducts - суммировать товары всех автоматов или возвращать планогрмму автомата
     */
    let { automatsId, sumProducts } = request.qs()
    automatsId = automatsId.map((id) => parseInt(id))
    sumProducts = strToBool(sumProducts)

    const automats = await Automat.query()
      .whereIn('id', automatsId)
      .andWhere('accountId', auth.user.accountId)

    if (automats.length !== automatsId.length)
      return response.badRequest({ message: Message.ACCESS_DENIED })

    let { rows: automatProducts } = await Database.rawQuery(`
      SELECT
        ap.*, p.name, p.recipe, p.unit, p.tax, p.subject, p.sku,
        pc.name as category_name,
        ap.id as automat_product_id,
        ${sumProducts ? 'p.id as id' : 'p.id as product_id'}
      FROM automat_products ap
        JOIN products p ON p.id = ap.product_id
        JOIN product_categories pc ON pc.id = p.product_category_id
        JOIN automats a ON a.id = ap.automat_id
      WHERE ap.automat_id IN (${automatsId.join(',')}) AND a.account_id = ${auth.user.accountId}
      GROUP BY ap.id, p.id, p.name, p.recipe, p.unit, p.tax, p.subject, p.sku, pc.name
    `)

    if (!automatProducts.length) return response.badRequest({ message: 'Нет товаров' })

    const recipes = automatProducts.filter((product) => product.recipe)
    automatProducts = automatProducts.filter((product) => !product.recipe)

    let ingredients: unknown[] | null = null
    if (recipes.length) {
      const recipesId = recipes.map((recipe) => recipe.product_id)

      const { rows: result } = await Database.rawQuery(`
        SELECT
          r.*, r.ingredient_id as id, r.id as reservior_id, r.number as slot,
          i.tax, i.sku, pc.name as category_name
        FROM composite_products_ingredients cpi
          JOIN reserviors r ON r.ingredient_id = cpi.ingredient_id
          JOIN ingredients i ON i.id = cpi.ingredient_id
          JOIN products p ON p.id = cpi.product_id
          JOIN product_categories pc ON pc.id = p.product_category_id
        WHERE cpi.product_id IN (${recipesId.join(',')})
        AND r.automat_id IN (${automatsId.join(',')})
        GROUP BY r.ingredient_id, r.id, i.tax, i.sku, pc.name
      `)
      ingredients = sumProductsReserviorsValues(result) // ингредиентов суммируем всегда
    }

    response.send({
      result: {
        [sumProducts ? 'products' : 'automatProducts']:
          sumProductsReserviorsValues(automatProducts), // суммируем товаров если автоматов несколько
        ingredients,
      },
    })
    logger.info(
      `${auth.user.email} get automats products ingredients`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const automatProductsCopy = async ({ auth, request, response }) => {
  try {
    const { fromAutomatId, toAutomatId } = request.params()

    const { rows: automatProducts } = await Database.rawQuery(`
      SELECT ${toAutomatId} as automat_id, product_id, automat_price, max_value, slot
      FROM automat_products WHERE automat_id = ${fromAutomatId}
    `)

    if (!automatProducts.length) return response.badRequest({ message: 'Нет товаров' })

    const automatProductsCreated = await AutomatProduct.createMany(automatProducts)

    const reserviors = await createReserviorsForAutomatProducts(
      automatProducts,
      +toAutomatId,
      auth.user.accountId
    )

    response.send({ result: { reserviors, automatProducts: automatProductsCreated } })
    logger.info(
      `${auth.user.email} copy automats products from ${fromAutomatId} to ${toAutomatId}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

const createReserviorsForAutomatProducts = async (
  automatProducts: ModelObject[] | AutomatProduct[],
  automatId: number,
  accountId: number
) => {
  let reserviors: Reservior[] = []
  if (automatProducts.length) {
    const recipes = await Product.query()
      .select('id')
      .whereIn(
        'id',
        automatProducts.map((product) => product.product_id || product.productId)
      )
      .andWhere('recipe', true)

    const recipesId = removeArrSameItems(recipes.map((recipe) => recipe.id))

    if (recipesId.length) {
      let ingredients: Ingredient[] = await Database.from('composite_products_ingredients as cpi')
        .join('ingredients', 'ingredients.id', '=', 'cpi.ingredient_id')
        .select('ingredients.id', 'ingredients.name', 'ingredients.unit', 'ingredients.weight')
        .whereIn('cpi.product_id', recipesId)

      if (ingredients.length) {
        ingredients = removeArrSameObjects(ingredients, 'id')
        const {
          rows: [{ count: reserviorsCount }],
        } = await Database.rawQuery(
          'SELECT COUNT(id)::INTEGER FROM reserviors WHERE account_id = ? AND automat_id = ?',
          [accountId, automatId]
        )

        const insertReserviors: Reservior[] = []

        for (let i = 0; i < ingredients.length; i++) {
          const ingredient = ingredients[i]
          const reservior = await Reservior.query()
            .where('automatId', automatId)
            .andWhere('ingredientId', ingredient.id)
            .andWhere('accountId', accountId)
            .first()
          if (!reservior) {
            insertReserviors.push({
              accountId: accountId,
              automatId,
              ingredientId: ingredient.id,
              name: ingredient.name,
              unit: ingredient.unit,
              balance: 0,
              maxVolume: 0,
              number: 100 + parseInt(reserviorsCount) + i,
            } as Reservior)
          }
        }

        reserviors = await Reservior.createMany(insertReserviors)
      }
    }
  }

  return reserviors
}
