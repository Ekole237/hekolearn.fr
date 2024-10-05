import AuthRepository from '#authentication/repositories/auth_repository'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthServices {
  constructor(private authRepository: AuthRepository) {}

  public async verifyCredentials({ email, password }: { email: string; password: string }) {
    return await this.authRepository.verifyCredentials(email, password)
  }

  public async generateToken(user: any) {
    return await this.authRepository.generateToken(user)
  }
}
