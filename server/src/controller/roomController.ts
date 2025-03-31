import {
    Controller,
    Post,
    Body,
    Res,
    HttpStatus,
    UseGuards,
    Req,
} from "@nestjs/common";
import { Response, Request } from "express";
import { JwtAuthGuard } from "src/middleware/jwtAuthGuard";
import { makeResponse } from "src/utils/makeResponse";
import { RoomService } from "../services/roomService";
import { AuthService } from "src/services/authService";
import { RoomHeader } from "src/interfaces/roomInterface";
import { generateNewId } from "src/utils/generateNewId";
import dayjs from "dayjs";

@Controller()
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
        private readonly AuthService: AuthService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post("/newRoom")
    async newRoom(
        @Body() body: RoomHeader,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request
    ) {
        try {
            const RoomHeader = await this.roomService.headerConstructor(body);

            if (!RoomHeader) {
                makeResponse(res, HttpStatus.BAD_REQUEST, "Erro ao criar a sala. Verifique as informações enviadas", true);
                return;
            }

            const validationRoomHeader = await this.roomService.validateRoomHeader(RoomHeader);

            if (!validationRoomHeader) {
                makeResponse(res, HttpStatus.BAD_REQUEST, "Erro ao criar a sala. Verifique as informações enviadas", true);
                return;
            }

            await this.roomService.createRoom(RoomHeader);

            makeResponse(res, HttpStatus.CREATED, `Sala ${RoomHeader.id} criada com sucesso`, false, { ...RoomHeader });

            console.log("a sala: " + RoomHeader.id + " foi criada.");
        } catch (error) {
            console.error(error);
            makeResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao criar sala", true);
            return;
        }

    }
}


