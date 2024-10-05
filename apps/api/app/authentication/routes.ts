import router from '@adonisjs/core/services/router'
const AuthOauthController = () => import('#authentication/controllers/auth_oauth_controller')
const AuthLoginController = () => import('#authentication/controllers/auth_login_controller')

router
  .group(() => {
    router.post('auth/login', [AuthLoginController, 'login']).as('auth.login')
  })
  .prefix('api/')

router
  .group(() => {
    router
      .get('/:provider/redirect', [AuthOauthController, 'redirect'])
      .where('provider', /github/)
      .as('auth.oauth.redirect')
    router
      .get('/:provider/callback', [AuthOauthController, 'callback'])
      .where('provider', /github/)
      .as('auth.oauth.callback')
  })
  .prefix('/oauth')
