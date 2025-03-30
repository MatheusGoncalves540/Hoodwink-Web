import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DatabaseModule } from "./modules/databaseModule";
import { UsersModule } from "./modules/usersModule";
import { AuthService } from "./services/authService";
import { RefreshTokenMiddleware } from "./middleware/refreshTokenMiddleware";
@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [],
  providers: [AuthService],
})
export class HoodwinkModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes('*');
  }
}
