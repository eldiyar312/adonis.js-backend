import logger, { createLogMessage } from '../../../../libs/logger'
import {
  CreatePulsePlanogramUnitValidator,
  CreatePulsePlanogramValidator,
  RemovePulsePlanogramValidator,
  UpdatePulsePlanogramUnitValidator,
  UpdatePulsePlanogramValidator,
} from 'App/Validators/PulsePlanogramValidator'
import PulsePlanogram from 'App/Models/PulsePlanogram'
import PulseUnit from 'App/Models/PulseUnit'
import { Message } from '../../../../constants'
import { deliveredCubeCancellation } from 'App/Models/hooks/General/deliveredCubeCancellation'

export const getPulsePlanograms = async ({ auth, request, response }) => {
  try {
    const { automatId } = request.qs()
    let result: PulsePlanogram[] = []

    if (automatId) {
      result = await PulsePlanogram.query()
        .where('accountId', auth.user.accountId)
        .andWhere('automatId', +automatId)
    } else {
      result = await PulsePlanogram.query().where('accountId', auth.user.accountId)
    }

    response.send({ result })
    logger.info('pulse palanograms got', createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const createPulsePlanograms = async ({ auth, request, response }) => {
  try {
    await request.validate(CreatePulsePlanogramValidator)

    const { planograms } = request.body()

    const exist = await PulsePlanogram.query()
      .whereIn(
        'productName',
        planograms.map((p: PulsePlanogram) => p.productName)
      )
      .andWhere('accountId', auth.user.accountId)

    if (exist.length) {
      return response.badRequest({ message: Message.DATA_NAME_EXISTS })
    }

    const createPlanograms = planograms.map((planogram) => ({
      accountId: auth.user.accountId,
      ...planogram,
    }))
    const result = await PulsePlanogram.createMany(createPlanograms)

    response.send({ result })
    logger.info('pulse palanograms created', createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const updatePulsePlanograms = async ({ auth, request, response }) => {
  try {
    await request.validate(UpdatePulsePlanogramValidator)

    const { planograms }: { planograms: PulsePlanogram[] } = request.body()

    const result: PulsePlanogram[] = []

    for (let i = 0; i < planograms.length; i++) {
      const exist = await PulsePlanogram.query()
        .where({
          productName: planograms[i].productName,
          accountId: auth.user.accountId,
          automatId: planograms[i].automatId,
        })
        .first()

      if (exist && exist.id !== planograms[i].id)
        return response.badRequest({ message: Message.DATA_NAME_EXISTS })
    }

    for (let i = 0; i < planograms.length; i++) {
      const { id, ...body } = planograms[i]
      const planogram = await PulsePlanogram.query()
        .where('id', id)
        .andWhere('accountId', auth.user.accountId)
        .andWhere('automatId', body.automatId)
        .first()

      if (!planogram) continue
      const updated = await planogram.merge(body).save()
      result.push(updated)
    }

    response.send({ result })
    logger.info('pulse palanograms update', createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const removePulsePlanograms = async ({ auth, request, response }) => {
  try {
    await request.validate(RemovePulsePlanogramValidator)

    const { planograms } = request.body()

    const planogramsForDelete = await PulsePlanogram.query()
      .whereIn('id', planograms)
      .andWhere('accountId', auth.user.accountId)

    for (const planogram of planogramsForDelete) {
      deliveredCubeCancellation(planogram, PulsePlanogram)
    }

    const result = await PulsePlanogram.query()
      .whereIn('id', planograms)
      .andWhere('accountId', auth.user.accountId)
      .delete()

    response.send({ result })
    logger.info('pulse palanograms remove', createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getPulsePlanogramUnits = async ({ auth, request, response }) => {
  try {
    const result = await PulseUnit.query().where('userId', auth.user.id).orWhereNull('userId')

    response.send({ result })
    logger.info('pulse planogram units got', createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const createPulsePlanogramUnits = async ({ auth, request, response }) => {
  try {
    await request.validate(CreatePulsePlanogramUnitValidator)

    let { units } = request.body()

    units = units.map((unit) => ({
      userId: auth.user.id,
      ...unit,
    }))
    const result = await PulseUnit.createMany(units)

    response.send({ result })
    logger.info('pulse planogram units created', createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const updatePulsePlanogramUnits = async ({ request, response, auth }) => {
  try {
    await request.validate(UpdatePulsePlanogramUnitValidator)

    const { units } = request.body()

    const result: PulseUnit[] = []

    for (let i = 0; i < units.length; i++) {
      const { id, ...body } = units[i]
      const updated = await PulseUnit.query()
        .where('id', id)
        .andWhere('userId', auth.user.id)
        .first()
      if (!updated) continue
      await updated.merge(body).save()
      result.push(updated)
    }

    response.send({ result })
    logger.info('pulse planogram units updated', createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}
