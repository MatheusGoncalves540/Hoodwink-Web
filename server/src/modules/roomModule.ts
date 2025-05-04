import { Module } from "@nestjs/common";
import { RoomController } from "src/controller/roomController";
import { AuthService } from "src/services/authService";
import { RoomService } from "src/services/roomService";

@Module({
    imports: [],
    controllers: [RoomController],
    providers: [RoomService, AuthService]
})
export class RoomModule { }
