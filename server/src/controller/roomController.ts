import { Controller, Post, Body, Res, HttpStatus, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "src/middleware/jwtAuthGuard";
import { makeResponse } from "src/utils/makeResponse";
import { RoomService } from "../services/roomService";
import { v7 as uuidv7 } from 'uuid'

export interface NewRoomData {
    id: string;
    nickname: string;
    roomName: string;
    maxPlayer: number;
    roomPass: string;
    startCoins: number;
    maxCoins: number;
    displayTime_withPossibleCounterPlays: number;
    displayTime_highRelevance: number;
    displayTime: number;
}

@Controller()
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post("/newRoom")
    async newRoom(@Body() newRoomData: NewRoomData, @Res({ passthrough: true }) res: Response) {
        newRoomData.id = generateNewId();

        const validationNewRoomData = await this.roomService.validateCreatedRoom(res, newRoomData);

        if (!validationNewRoomData) return makeResponse(res, HttpStatus.BAD_REQUEST, "Informações inválidas", true);

        const createdRoom = await this.roomService.createRoom(newRoomData);

        makeResponse(res, HttpStatus.CREATED, `Sala ${newRoomData.id} criada com sucesso`, false, { ...newRoomData });

        // res.json({
        //     roomId: rooms[idNewRoom].header.roomId,
        //     roomPass: rooms[idNewRoom].header.roomPass,
        //     nickname: newRoomData.nickname
        // });

        console.log("a sala: " + newRoomData.id + " foi criada.");

        return;
    }
}
