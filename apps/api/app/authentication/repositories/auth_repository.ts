import User from '#models/user'

export default class AuthRepository {
  public async verifyCredentials(email: string, password: string) {
    return await User.verifyCredentials(email, password)
  }

  public async generateToken(user: any) {
    return await User.accessTokens.create(user)
  }
}
