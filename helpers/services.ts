import Mail from '@ioc:Adonis/Addons/Mail'
import axios from 'axios'
import config from 'Config/config'
import request from 'request-promise-native'
interface TMail {
  email: string
  subject: string
  body: string
  url?: string
  buttonText?: string
  footerText?: string
}

export const mail = async (data: TMail) => {
  const result = await Mail.send((message) => {
    message
      .from('noreply-cube-test@something.ru')
      .to(data.email)
      .subject(data.subject)
      .htmlView('emails/form', {
        emailTitle: data.subject,
        emailBody: data.body,
        url: data.url || 'https://something.ru',
        buttonText: data.buttonText || 'Перейти в личный кабинет',
        footerText:
          data.footerText ||
          'Вы получили это письмо, так как являетесь клиентом компании АО Пи Джи Групп и произвели регистрацию в Личном Кабинете.',
      })
  }).catch((err) => err.message && { message: err.message })

  if (result.message) return { status: false, message: result.message }
  return { status: true }
}

export const notifier = async (data: TMail) => {
  const result = await Mail.send((message) => {
    message
      .from('noreply-something@something.ru')
      .to(data.email)
      .subject(data.subject)
      .html(data.body)
  }).catch((err) => err.message && { message: err.message })

  if (result.message) return { status: false, message: result.message }
  return { status: true }
}

export const smsAero = async (number: string, text: string) => {
  const result = await axios.get(
    'https://something@gmail.com:something@gate.smsaero.ru/v2/sms/send',
    {
      params: {
        number,
        text,
        from: 'something',
        sign: 'something',
      },
    }
  )
  if (!result.data.success) return { status: false, message: result.data.message }
  return { status: true }
}

const AVAILABLE_METHODS = ['get', 'post', 'put', 'patch', 'del']

class HttpClient {
  get: (path: string, data: any) => Promise<any>
  post: (path: string, data: any) => Promise<any>
  put: (path: string, data: any) => Promise<any>
  patch: (path: string, data: any) => Promise<any>
  del: (path: string, data: any) => Promise<any>

  request
  constructor(baseUrl) {
    this.request = request.defaults({
      baseUrl,
      headers: { 'cache-control': 'no-cache' },
      json: true,
      gzip: true,
    })

    AVAILABLE_METHODS.forEach((method) => {
      this[method] = async (path, data, queryString) => {
        const response = await this.request[method]({ url: path, body: data, qs: queryString })
        return response
      }
    })
  }
}

export const devicesServer = new HttpClient(`http://${config.devicesServices.devicesServer}/api/v1`)
export const tmsServer = new HttpClient(`http://${config.devicesServices.tmsServer}/api/v1`)
