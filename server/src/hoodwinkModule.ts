import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DatabaseModule } from "./modules/databaseModule";
import { UsersModule } from "./modules/usersModule";
import { AuthService } from "./services/authService";
import { RefreshTokenMiddleware } from "./middleware/refreshTokenMiddleware";
import { RoomModule } from "./modules/roomModule";

@Module({
  imports: [DatabaseModule, UsersModule, RoomModule],
  controllers: [],
  providers: [AuthService],
})

export class HoodwinkModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes('*');
  }
}
