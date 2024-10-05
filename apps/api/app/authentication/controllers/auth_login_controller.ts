import AuthServices from '#authentication/services/auth_services'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthLoginController {
  constructor(private authService: AuthServices) {}

  public async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    try {
      const user = await this.authService.verifyCredentials({ email, password })
      return await this.authService.generateToken(user)
    } catch (error) {
      return response.status(400).json({ message: 'Invalid credentials' })
    }
  }
}
