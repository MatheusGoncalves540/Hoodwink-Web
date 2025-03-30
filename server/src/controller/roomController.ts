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
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("/newRoom")
  async newRoom(
    @Body() RoomHeader: RoomHeader,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {    
    RoomHeader.id = generateNewId();
    RoomHeader.startTime = dayjs()

    const validationRoomHeader = await this.roomService.validateCreatedRoom(
      res,
      RoomHeader
    );

    if (!validationRoomHeader)
      return makeResponse(
        res,
        HttpStatus.BAD_REQUEST,
        "Informações inválidas",
        true
      );

    await this.roomService.createRoom(RoomHeader);

    makeResponse(
      res,
      HttpStatus.CREATED,
      `Sala ${RoomHeader.id} criada com sucesso`,
      false,
      { ...RoomHeader }
    );

    console.log("a sala: " + RoomHeader.id + " foi criada.");
  }
}


