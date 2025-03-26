import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DatabaseModule } from "./modules/databaseModule";
import { RegisterModule } from "./modules/registerModule";
import { UsersModule } from "./modules/usersModule";
import { LoginModule } from "./modules/loginModule";
import { AuthService } from "./services/authService";
import { RefreshTokenMiddleware } from "./middleware/refreshTokenMiddleware";
@Module({
  imports: [DatabaseModule, UsersModule, RegisterModule, LoginModule],
  controllers: [],
  providers: [AuthService],
})
export class HoodwinkModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes('*');
  }
}
