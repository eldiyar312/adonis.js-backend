/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  API_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  DRIVE_DISK: Env.schema.enum(['local'] as const),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  EXPIRES_IN: Env.schema.string(),
  FRONT_HOST: Env.schema.string(),
  BACK_HOST: Env.schema.string(),

  PG_HOST: Env.schema.string({ format: 'host' }),
  PG_PORT: Env.schema.number(),
  PG_USER: Env.schema.string(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DB_NAME: Env.schema.string(),

  REDIS_CONNECTION: Env.schema.enum(['local'] as const),
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),

  SMTP_HOST: Env.schema.string({ format: 'host' }),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),

  CACHE_VIEWS: Env.schema.boolean(),

  TOCAN_SFTP_HOST: Env.schema.string({ format: 'host' }),
  TOCAN_SFTP_PORT: Env.schema.number(),
  TOCAN_SFTP_USERNAME: Env.schema.string(),
  TOCAN_SFTP_PASSWORD: Env.schema.string(),
  TOCAN_HTTP_BASEURL: Env.schema.string(),
  TOCAN_HTTP_LOGIN: Env.schema.string(),
  TOCAN_HTTP_SECRETKEY: Env.schema.string(),

  DEVICES_SERVICES_DEVICES_SERVER: Env.schema.string(),
  DEVICES_SERVICES_TMS_SERVER: Env.schema.string(),
})
