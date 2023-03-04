import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { apiKey } from 'Config/app'
/**
 * AuthTrustedApp middleware is meant to restrict un-authenticated access to a given route
 * or a group of routes.
 *
 * You must register this middleware inside `start/kernel.ts` file under the list
 * of named middleware.
 */
export default class AuthTrustedAppMiddleware {
  /**
   * The URL to redirect to when request is Unauthorized
   */
  protected redirectTo = '/login'

  /**
   * Authenticates the current HTTP request against an api key
   */
  protected async authenticate(request: HttpContextContract['request']) {
    if (request.header('apikey') === apiKey) return true
    /**
     * Unable to authenticate using api key
     */
    throw new AuthenticationException(
      'Unauthorized access',
      'E_UNAUTHORIZED_ACCESS',
      undefined,
      this.redirectTo
    )
  }

  /**
   * Handle request
   */
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    /**
     * Uses the api key to authenticate app
     */
    await this.authenticate(request)
    await next()
  }
}
