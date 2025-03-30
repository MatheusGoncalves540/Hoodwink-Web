import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoginController } from "src/controller/loginController";
import { RegisterController } from "src/controller/registerController";
import { User } from "src/database/entity/userEntity";
import { AuthService } from "src/services/authService";
import { LoginService } from "src/services/loginService";
import { RegisterService } from "src/services/registerService";
import { UsersService } from "src/services/usersService";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [LoginController, RegisterController],
    providers: [UsersService, RegisterService, LoginService, AuthService],
    exports:[UsersService]
})
export class UsersModule { }
