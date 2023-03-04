import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
import Automat from 'App/Models/Automat'
import AutomatProduct from 'App/Models/AutomatProduct'
import AutomatSetting from 'App/Models/AutomatSetting'
import PulsePlanogram from 'App/Models/PulsePlanogram'
import ServiceMenuLogin from 'App/Models/ServiceMenuLogin'

type TModels = AutomatSetting | PulsePlanogram | AutomatProduct | ServiceMenuLogin

export const deliveredCubeCancellation = async (table: TModels, model: LucidModel) => {
  if (model.name === 'PulsePlanogram') {
    // обновление пометки для повторной отправки в куб
    await Automat.updateOrCreate(
      { id: (table as PulsePlanogram).automatId },
      { pulsePlanogramDeliveredCube: 0 }
    )
    return
  }

  const found = await model.query().where('id', table.id).first()

  if (!found) return

  await found.merge({ deliveredCube: 0 }).save()
}
