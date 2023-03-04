import User from 'App/Models/User'
import SettingValidator from 'App/Validators/SettingValidator'
import { Regex, template, redisKey, Message } from '../../../constants'
import Env from '@ioc:Adonis/Core/Env'
import Hash from '@ioc:Adonis/Core/Hash'
import Organization from 'App/Models/Organization'
import { mail, smsAero } from '../../../helpers/services'
import Redis from '@ioc:Adonis/Addons/Redis'
import logger, { createLogMessage } from '../../../libs/logger'

export const updateSetting = async ({ auth, request, response }) => {
  try {
    await request.validate(SettingValidator)

    const { profile, password, organization } = request.body()

    if (password && password.oldPassword === password.newPassword) {
      return response.badRequest({ message: Message.PASSWORD_NOT_MATCH })
    }

    const messages: string[] = []

    if (profile) {
      if (profile.name) {
        await User.updateOrCreate({ id: auth.user.id }, { name: profile.name })
        messages.push('ФИО успешно изменён')
      }

      const url = `${Env.get('FRONT_HOST')}/confirm/email/${auth.user.remember_me_token}`

      if (profile.email && profile.email !== auth.user.email && Regex.email.test(profile.email)) {
        const mailData = {
          subject: 'Подтверждение новой почты',
          body: template.confirmEmail(url),
          email: profile.email,
          url,
        }
        const result = await mail(mailData)

        if (!result.status) return response.badRequest({ messages: result.message })
        messages.push(`Мы отправили ссылку для подтверждения на почту ${profile.email}`)
        await Redis.set(redisKey.updateEmail(auth.user.id), profile.email)
        await User.updateOrCreate({ id: auth.user.id }, { active: false })
      } else if (
        profile.email &&
        profile.email !== auth.user.email &&
        Regex.phone.test(profile.email)
      ) {
        // if this phone number
        const result = await smsAero(
          profile.email,
          'Здравствуйте. Пройдите по ссылке для подтверждения нового номера телефона: ' + url
        )
        if (!result.status) return response.send({ message: result.message })
        messages.push(`Мы отправили ссылку для подтверждения на номер: ${profile.email}`)
        await Redis.set(redisKey.updateEmail(auth.user.id), profile.email)
        await User.updateOrCreate({ id: auth.user.id }, { active: false })
      }
    }

    if (password && Object.keys(password).length) {
      if (!(await Hash.verify(auth.user.password, password.oldPassword))) {
        return response.badRequest({ message: 'Не верный пароль' })
      }

      await User.updateOrCreate({ id: auth.user.id }, { password: password.newPassword })

      messages.push('Пароль успешно изменён')
    }
    if (organization) {
      await Organization.updateOrCreate({ accountId: auth.user.accountId }, organization)
      messages.push('Данные организации успешно изменены')
    }

    response.send({ result: null, message: messages })
    logger.info(
      `Пользователь ${auth.user.id} изменил настройки`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.messages })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getSetting = async ({ auth, response, request }) => {
  try {
    const user = await User.findBy('id', auth.user.id)
    const organization = await Organization.findBy('accountId', auth.user.accountId)

    response.send({ result: { user, organization } })
    logger.info(
      `Пользователь ${auth.user.id} получил настройки`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.messages })
    logger.error(error, createLogMessage({ request, response }))
  }
}
