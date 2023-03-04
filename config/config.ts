import Env from '@ioc:Adonis/Core/Env'
import { Config } from '@ioc:Adonis/Core/Config'

const config: Config = {
  tocan: {
    sftp: {
      host: Env.get('TOCAN_SFTP_HOST'),
      port: Env.get('TOCAN_SFTP_PORT'),
      username: Env.get('TOCAN_SFTP_USERNAME'),
      password: Env.get('TOCAN_SFTP_PASSWORD'),
    },
    http: {
      baseUrl: Env.get('TOCAN_HTTP_BASEURL'),
      Login: Env.get('TOCAN_HTTP_LOGIN'),
      secretkey: Env.get('TOCAN_HTTP_SECRETKEY'),
    },
  },
  devicesServices: {
    devicesServer: Env.get('DEVICES_SERVICES_DEVICES_SERVER'),
    tmsServer: Env.get('DEVICES_SERVICES_TMS_SERVER'),
  },
}

export default config
