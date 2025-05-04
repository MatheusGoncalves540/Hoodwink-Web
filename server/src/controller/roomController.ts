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
import { decodedJwtToken } from "src/interfaces/decodedJwtToken";

@Controller()
export class RoomController {
    constructor(
        private readonly roomService: RoomService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post("/newRoom")
    async newRoom(
        @Req() req: Request,
        @Body() body: RoomHeader,
        @Res({ passthrough: true }) res: Response,
    ) {
        try {
            const RoomHeader = await this.roomService.headerConstructor(body, req.decodedToken);
            if (!RoomHeader) {
                makeResponse(res, HttpStatus.BAD_REQUEST, "Erro ao criar a sala. Verifique as informações enviadas", true);
                return;
            }

            const validationRoomHeader = await this.roomService.validateRoomHeader(RoomHeader);
            if (!validationRoomHeader) {
                makeResponse(res, HttpStatus.BAD_REQUEST, "Erro ao criar a sala. Verifique as informações enviadas", true);
                return;
            }

            const successOnCreateRoom = await this.roomService.createRoom(RoomHeader);

            if (!successOnCreateRoom) {
                makeResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao criar a sala. Tente novamente", true);
                return;
            }

            makeResponse(res, HttpStatus.CREATED, `Sala ${RoomHeader.id} criada com sucesso`, false, { ...RoomHeader });

            console.log("a sala: " + RoomHeader.id + " foi criada.");
        } catch (error) {
            console.error(error);
            makeResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao criar sala", true);
            return;
        }
    }
}


