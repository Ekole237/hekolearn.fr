import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthOauthController {
  async redirect({ ally, params }: HttpContext) {
    return ally.use(params.provider).stateless().redirect()
  }

  async callback({ ally, params, response }: HttpContext) {
    const gh = ally.use(params.provider).stateless()

    if (gh.accessDenied()) {
      return response.redirect('http://localhost:3000/login?error=access_denied')
    }

    if (gh.stateMisMatch()) {
      return response.redirect('http://localhost:3000/login?error=state_mismatch')
    }

    if (gh.hasError()) {
      return response.redirect('http://localhost:3000/login?error=has_error')
    }

    const user = await gh.user()
    console.log(user)
  }
}
