import AutomatSetting from 'App/Models/AutomatSetting'
import AutomatSettingFiscalization from 'App/Models/AutomatSettingFiscalization'
import AutomatSettingModeExeMaster from 'App/Models/AutomatSettingModeExeMaster'
import AutomatSettingModeMdb from 'App/Models/AutomatSettingModeMdb'
import AutomatSettingModeMdbExe from 'App/Models/AutomatSettingModeMdbExe'
import AutomatSettingModePulse from 'App/Models/AutomatSettingModePulse'
import AutomatSettingModePose from 'App/Models/AutomatSettingModePose'
import AutomatSettingSchedule from 'App/Models/AutomatSettingSchedule'
import AutomatSettingValidator from 'App/Validators/AutomatSettingValidator'
import Automat from 'App/Models/Automat'
import { Message } from '../../../../constants'
import logger, { createLogMessage } from '../../../../libs/logger'

export const getAutomatSetting = async ({ response, request, auth }) => {
  try {
    const { automatId } = request.params()

    const automat = await Automat.query()
      .where('id', automatId)
      .andWhere('accountId', auth.user.accountId)
      .first()
    if (!automat) return response.badRequest({ message: Message.NO_AUTOMAT })
    const setting = await AutomatSetting.query().where('automatId', automatId).first()
    if (!setting) return response.badRequest({ message: Message.NO_SETTING })

    let children: Automat[] = []
    children = await Automat.query().where('parentId', '=', automatId)

    const fiscalization = await AutomatSettingFiscalization.findBy('id', setting?.fiscalizationId)
    const modeExeMaster = await AutomatSettingModeExeMaster.findBy('id', setting?.modeExeMasterId)
    const modeMdb = await AutomatSettingModeMdb.findBy('id', setting?.modeMdbId)
    const modeMdbExe = await AutomatSettingModeMdbExe.findBy('id', setting?.modeMdbExeId)
    const modePulse = await AutomatSettingModePulse.findBy('id', setting?.modePulseId)
    const modePose = await AutomatSettingModePose.findBy('id', setting?.modePoseId)
    const schedule = await AutomatSettingSchedule.findBy('id', setting?.scheduleId)

    response.send({
      result: {
        setting,
        automat: { ...automat?.$attributes, children },
        fiscalization,
        modeExeMaster,
        modeMdb,
        modeMdbExe,
        modePulse,
        modePose,
        schedule,
      },
    })
    logger.info(
      `${auth.user.email} got automat setting ${automatId}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const updateAutomatSetting = async ({ auth, response, request }) => {
  try {
    await request.validate(AutomatSettingValidator)

    const { automatId } = request.params()
    const body = request.body()

    const automat = await Automat.query()
      .where('id', automatId)
      .andWhere('accountId', auth.user.accountId)
      .first()
    if (!automat) return response.badRequest({ message: Message.NO_AUTOMAT })

    const result = {}

    if (body.setting) {
      result['setting'] = await AutomatSetting.updateOrCreate({ automatId }, body.setting)
    }
    if (body.automat) {
      if (body.automat?.name) {
        const [alreadyExists] = await Automat.query()
          .where('name', body.automat.name)
          .andWhere('account_id', auth.user.accountId)
          .andWhere('id', '!=', automatId)
        if (alreadyExists) return response.badRequest({ message: Message.AUTOMAT_NAME_EXISTS })
      }
      result['automat'] = await Automat.updateOrCreate({ id: automatId }, body.automat)
    }
    if (body.schedule) {
      result['schedule'] = await AutomatSettingSchedule.updateOrCreate(
        { id: body.schedule.id },
        body.schedule
      )
    }
    if (body.fiscalization) {
      result['fiscalization'] = await AutomatSettingFiscalization.updateOrCreate(
        { id: body.fiscalization.id },
        body.fiscalization
      )
    }
    if (body.modeMdb) {
      result['modeMdb'] = await AutomatSettingModeMdb.updateOrCreate(
        { id: body.modeMdb.id },
        body.modeMdb
      )
    }
    if (body.modeExeMaster) {
      result['modeExeMaster'] = await AutomatSettingModeExeMaster.updateOrCreate(
        { id: body.modeExeMaster.id },
        body.modeExeMaster
      )
    }
    if (body.modeMdbExe) {
      result['modeMdbExe'] = await AutomatSettingModeMdbExe.updateOrCreate(
        { id: body.modeMdbExe.id },
        body.modeMdbExe
      )
    }
    if (body.modePulse) {
      result['modePulse'] = await AutomatSettingModePulse.updateOrCreate(
        { id: body.modePulse.id },
        body.modePulse
      )
    }
    if (body.modePose) {
      result['modePose'] = await AutomatSettingModePose.updateOrCreate(
        { id: body.modePose.id },
        body.modePose
      )
    }
    if (body?.createChildren?.length) {
      await Automat.createMany(
        body.createChildren.map((child) => ({
          ...child,
          accountId: auth.user.accountId,
          parentId: automatId,
        }))
      )
    }
    if (body?.updateChildren?.length) {
      for (let i = 0; i < body.updateChildren.length; i++) {
        const child = body.updateChildren[i]
        await Automat.updateOrCreate({ id: child.id }, child)
      }
    }

    response.send({ result })
    logger.info(
      `${auth.user.email} updated automat setting ${automatId}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const automatSettingCopy = async ({ request, response, auth }) => {
  try {
    const { fromAutomatId, toAutomatId } = request.params()

    const automat = await Automat.query()
      .where('id', '=', toAutomatId)
      .andWhere('accountId', '=', auth.user.accountId)
      .first()
    if (!automat) return response.badRequest({ message: Message.NO_AUTOMAT })

    const settings = await AutomatSetting.findBy('automatId', fromAutomatId)
    if (!settings) return response.badRequest({ message: Message.NO_SETTING })

    delete settings.$original.id

    const oldSettings = await AutomatSetting.findBy('automat_id', +toAutomatId)

    if (oldSettings) {
      const fiscalization = await AutomatSettingFiscalization.findBy(
        'id',
        oldSettings?.fiscalizationId
      )
      const modeExeMaster = await AutomatSettingModeExeMaster.findBy(
        'id',
        oldSettings?.modeExeMasterId
      )
      const modeMdb = await AutomatSettingModeMdb.findBy('id', oldSettings?.modeMdbId)
      const modeMdbExe = await AutomatSettingModeMdbExe.findBy('id', oldSettings?.modeMdbExeId)
      const modePulse = await AutomatSettingModePulse.findBy('id', oldSettings?.modePulseId)
      const modePose = await AutomatSettingModePose.findBy('id', oldSettings?.modePoseId)
      const schedule = await AutomatSettingSchedule.findBy('id', oldSettings?.scheduleId)

      await fiscalization?.delete()
      await modeExeMaster?.delete()
      await modeMdb?.delete()
      await modeMdbExe?.delete()
      await modePulse?.delete()
      await modePose?.delete()
      await schedule?.delete()
      await oldSettings.delete()
    }

    const newSetting = await AutomatSetting.create({
      ...settings.$original,
      automatId: +toAutomatId,
    })

    response.send({ result: newSetting })
    logger.info(
      `${auth.user.email} copied automat setting ${fromAutomatId} to ${toAutomatId}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}
