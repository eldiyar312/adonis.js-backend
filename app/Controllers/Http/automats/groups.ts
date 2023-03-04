import AutomatGroup from 'App/Models/AutomatGroup'
import AutomatGroupValidator, {
  AutomatOrangeDataGroupValidator,
} from 'App/Validators/AutomatGroupValidator'
import logger, { createLogMessage } from '../../../../libs/logger'
import { Message } from '../../../../constants'

export const createAutomatGroup = async ({ auth, request, response }) => {
  try {
    await request.validate(AutomatGroupValidator)

    const body = request.body()

    const [alreadyExists] = await AutomatGroup.query()
      .where('name', body.name)
      .andWhere('account_id', auth.user.accountId)
    if (alreadyExists) return response.badRequest({ message: Message.GROUP_NAME_EXISTS })

    body['accountId'] = auth.user.accountId

    const group = await AutomatGroup.create(body)

    response.send({ result: group })
    logger.info(
      `${auth.user.email} created automat group ${group.name}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getAutomatGroups = async ({ auth, response, request }) => {
  try {
    const groups = await AutomatGroup.query().where('accountId', '=', auth.user.accountId)

    response.send({ result: groups })
    logger.info(`${auth.user.email} got automat groups`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const deleteAutomatGroup = async ({ request, response, auth }) => {
  try {
    const { id } = request.params()

    const result = await AutomatGroup.query()
      .where('id', id)
      .andWhere('accountId', auth.user.accountId)
      .delete()

    response.send({ result })
    logger.info(
      `${auth.user.email} deleted automat group ${id}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const updateAutomatGroup = async ({ request, response, auth }) => {
  try {
    await request.validate(AutomatGroupValidator)

    const { id } = request.params()
    const body = request.body()

    const [alreadyExists] = await AutomatGroup.query()
      .where('name', body.name)
      .andWhere('account_id', auth.user.accountId)
      .andWhere('id', '!=', id)
    if (alreadyExists) return response.badRequest({ message: Message.GROUP_NAME_EXISTS })

    const group = await AutomatGroup.updateOrCreate({ id, accountId: auth.user.accountId }, body)

    response.send({ result: group })
    logger.info(
      `${auth.user.email} updated automat group ${group.name}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const updateAutomatGroups = async ({ request, response, auth }) => {
  try {
    await request.validate(AutomatOrangeDataGroupValidator)

    const { automatGroups } = request.body()

    for (let i = 0; i < automatGroups.length; i++) {
      const automatGroup: AutomatGroup = automatGroups[i]

      const result = await AutomatGroup.query()
        .where('id', automatGroup.id)
        .andWhere('accountId', auth.user.accountId)
        .first()

      if (!result) continue

      await result.merge({ orangeDataGroup: automatGroup.orangeDataGroup }).save()

      automatGroups[i] = result
    }

    response.send({ result: automatGroups })
    logger.info(
      `${auth.user.email} updated automat groups ${JSON.stringify(automatGroups)}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}
