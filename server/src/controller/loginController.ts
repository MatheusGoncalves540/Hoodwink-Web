import { Controller, Post, Body, Headers } from '@nestjs/common'
import { LoginService } from '../services/loginService'
import { LoginValidations } from 'src/validations/loginValidations'

@Controller()
export class LoginController {
  constructor(private readonly LoginService: LoginService) { }

  @Post('/register')
  register(
    @Body() body: any
  ): string {
    const login = body.login
    const password = body.password

    if (!LoginValidations.passwordValidation(password, login)) {
      return ("nao")
    }

    return this.LoginService.getHello()
  }
}