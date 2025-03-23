import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/database/entity/userEntity";
import { UsersService } from "src/services/usersService";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [],
    providers: [UsersService],
    exports:[UsersService]
})
export class UsersModule { }
