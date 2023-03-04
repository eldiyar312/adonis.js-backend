import Env from '@ioc:Adonis/Core/Env'
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'
import Superuser from 'App/Models/Superuser'
import User from 'App/Models/User'
import {
  InvitationConfirmValidator,
  UsersDeleteValidator,
  UserUpdateValidator,
  UserValidator,
} from 'App/Validators/UserValidator'
import { Message, Regex, smsTemplate, template, UserRole } from '../../../constants'
import { mail, smsAero } from '../../../helpers/services'
import logger, { createLogMessage } from '../../../libs/logger'

export const inviteUser = async ({ auth, request, response }) => {
  try {
    await request.validate(UserValidator)

    const { email, roleId, name, phone } = request.body()
    const inviter = auth.user

    if (!Regex.email.test(email) && !Regex.phone.test(email)) {
      return response.badRequest({
        message: Message.INVALID_DATA,
      })
    }

    let user = await User.query()
      .where('email', email)
      .andWhere('accountId', auth.user.accountId)
      .first()

    if (user && user.active) {
      return response.badRequest({
        message: Message.CUSTOMER_EXISTS,
      })
    }

    user = await User.updateOrCreate(
      { email },
      {
        name,
        email,
        phone,
        active: false,
        accountId: auth.user.accountId,
        roleId,
      }
    )

    const { token: access } = await auth
      .use('api')
      .generate(user, { expiresIn: Env.get('EXPIRES_IN') }) // 3 hours

    User.updateOrCreate({ id: user.id }, { remember_me_token: access, inviterId: inviter.id })
    const url = `${Env.get('FRONT_HOST')}/confirm/invitation/${access}`
    const discardUrl = `${Env.get('FRONT_HOST')}/discard/invitation/${access}`

    // if this email
    if (Regex.email.test(email)) {
      const emailData = {
        subject: 'Приглашение для регистрации в ЛК something CUBE',
        body: template.inviteUser(url, discardUrl, inviter.name, name),
        email,
        url,
        buttonText: 'Зарегистрироваться',
        footerText:
          'Вы получили это письмо, так как Вас пригласили зарегистрироваться в Личном Кабинете something Cube',
      }
      const result = await mail(emailData)

      if (!result.status) return response.badRequest({ message: result.message })

      return response.send({
        message: `Мы отправили ссылку для приглашения на почту: ${email}`,
      })
    }

    // if this phone number
    const result = await smsAero(email, smsTemplate.inviteUser(url, auth.user.name))
    if (!result.status) return response.badRequest({ message: result.message })

    response.send({
      result: null,
      message: 'Мы отправили ссылку для приглашения на номер: ' + email,
    })

    logger.info(`User ${user.id} invited`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const confirmInvitation = async ({ auth, response, request }) => {
  try {
    await request.validate(InvitationConfirmValidator)

    const { password } = request.body()

    const user = await User.query()
      .where('id', auth.user.id)
      .andWhere('accountId', auth.user.accountId)
      .first()

    const { token: newAccess } = await auth
      .use('api')
      .generate(user, { expiresIn: Env.get('EXPIRES_IN') })

    const refresh = await Hash.make(newAccess)

    await User.updateOrCreate(
      { id: auth.user.id },
      { remember_me_token: newAccess, active: true, password }
    )

    await auth.use('api').revoke()

    response.send({
      result: {
        user,
        tokens: { access: newAccess, refresh, expiresIn: Env.get('EXPIRES_IN') },
      },
    })
    logger.info(`User ${user?.id} confirmed invitation`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const discardInvitation = async ({ response, request }) => {
  try {
    const { token } = request.params()

    const user = await User.findBy('remember_me_token', token)

    if (user && !user.active) await user.delete() // if user is not active

    response.send({ result: 'Приглашение успешно отменено' })
    logger.info(`User ${user?.name} discard invitation`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getUserByToken = async ({ auth, response, request }) => {
  try {
    const { token } = request.params()

    const { rows: user } = await Database.rawQuery(
      `SELECT 
        u.name, u.email, u.phone, u.active, u.inviter_id, u.role_id, u.account_id,
        (SELECT name FROM users WHERE users.id = u.inviter_id) as inviter_name
      FROM users u
      WHERE u.remember_me_token = :token AND u.account_id = :accountId`,
      { token, accountId: auth.user.accountId }
    )

    response.send({ result: user })
    logger.info(`User ${user?.name} got`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const getUsers = async ({ auth, response, request }) => {
  try {
    const users = await User.query().where('accountId', auth.user.accountId)

    response.send({ result: users })
    logger.info(`User ${auth.user.id} got users`, createLogMessage({ request, response }))
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const updateUser = async ({ request, auth, response }) => {
  try {
    if (auth.user.roleId === UserRole.VENDING_OPERATOR) {
      return response.badRequest({ message: Message.ACCESS_DENIED })
    }

    await request.validate(UserUpdateValidator)

    const { userId, ...body } = request.body()

    const user = await User.query()
      .where('id', userId)
      .andWhere('accountId', auth.user.accountId)
      .first()

    let result
    if (user?.roleId === 2) {
      result = await User.updateOrCreate({ id: userId }, body)
    } else {
      const superuser = await Superuser.findBy('userId', auth.user.id)

      if (superuser) result = await User.updateOrCreate({ id: userId }, body)
    }

    response.send({ result })
    logger.info(
      `User ${auth.user.id} updated user ${userId}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}

export const deleteUsers = async ({ auth, request, response }) => {
  try {
    if (auth.user.roleId === UserRole.VENDING_OPERATOR) {
      return response.badRequest({ message: Message.ACCESS_DENIED })
    }

    await request.validate(UsersDeleteValidator)

    const { usersId } = request.body()

    for (let i = 0; i < usersId.length; i++) {
      const userId = usersId[i]
      const user = await User.query()
        .where('id', userId)
        .andWhere('accountId', auth.user.accountId)
        .first()

      if (user?.roleId === 2) {
        await user?.delete()
      } else {
        const superuser = await Superuser.findBy('userId', auth.user.id)

        if (superuser) await user?.delete()
      }
    }

    response.send({ message: Message.DELETED })
    logger.info(
      `User ${auth.user.id} deleted users ${usersId}`,
      createLogMessage({ request, response })
    )
  } catch (error) {
    response.badRequest({ message: error.message })
    logger.error(error, createLogMessage({ request, response }))
  }
}
