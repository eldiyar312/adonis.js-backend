import Integration from 'App/Models/Integration'
import { generateRSAKeyPair } from '../../../libs/rsa'
import logger, { createLogMessage } from '../../../libs/logger'

export const generateKey = async ({ auth, response, request }) => {
  try {
    const keys = generateRSAKeyPair()

    const integration = await Integration.updateOrCreate(
      { accountId: auth.user.accountId },
      { ...keys, accountId: auth.user.accountId }
    )

    response.send({ result: integration })

    logger.info(
      `${auth.user.email} generated public and private keys`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getIntegration = async ({ auth, response, request }) => {
  try {
    const integration = await Integration.findBy('accountId', auth.user.accountId)
    response.send({ result: integration })
    logger.info(`${auth.user.email} getIntegration`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const deleteIntegration = async ({ auth, response, request }) => {
  try {
    const integration = await Integration.findBy('accountId', auth.user.accountId)
    await integration?.delete()
    response.send({ result: { success: true } })
    logger.info(`${auth.user.email} delete integration`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}
