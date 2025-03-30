import { Module } from "@nestjs/common";
import { RoomController } from "src/controller/roomController";
import { RoomService } from "src/services/roomService";

@Module({
    imports: [],
    controllers: [RoomController],
    providers: [RoomService]
})
export class RoomModule { }
