import { Module } from '@nestjs/common'
import { LoginController } from './controller/loginController'
import { LoginService } from './services/loginService'

@Module({
  imports: [],
  controllers: [LoginController],
  providers: [LoginService],
})
export class HoodwinkModule { }
