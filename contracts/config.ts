declare module '@ioc:Adonis/Core/Config' {
  interface Config {
    tocan: {
      sftp: {
        host: string
        port: number
        username: string
        password: string
      }
      http: {
        baseUrl: string
        Login: string
        secretkey: string
      }
    }
    devicesServices: {
      devicesServer: string
      tmsServer: string
    }
  }
}
