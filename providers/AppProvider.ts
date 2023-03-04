import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const { ModelQueryBuilder } = this.app.container.use('Adonis/Lucid/Database')

    ModelQueryBuilder.macro('softDelete', function () {
      return this.update({ deletedAt: new Date().toISOString() })
    })
  }

  public async ready() {
    // App is ready
    const { jobRouteToOverdue } = await import('App/Services/cron')
    const { pinExpirationJob } = await import('App/Tasks/PinsScheduler')

    jobRouteToOverdue.start()
    pinExpirationJob.start()
  }

  public async shutdown() {
    // Cleanup, since app is going down
    const { jobRouteToOverdue } = await import('App/Services/cron')
    jobRouteToOverdue.stop()
  }
}
