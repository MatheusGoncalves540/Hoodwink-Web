import { Response } from "express";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { RoomHeader, RoomInterface } from "src/interfaces/roomInterface";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { generateNewId } from "src/utils/generateNewId";
import { decodedJwtToken } from "src/interfaces/decodedJwtToken";

@Injectable()
export class RoomService {
  constructor(@InjectRedis() private readonly redis: Redis) { }

  async createRoom(RoomHeader: RoomHeader): Promise<boolean> {
    try {
      const newRoom: RoomInterface = {
        header: RoomHeader,
        gameOver: false,
        turn: 0,
        currentTurnOwner: null,
        tax: 0,
        currentMove: {},
        playersWhoWantsToSkip: [],
        aliveDeck: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12],
        deadDeck: [],
        players: [],
        spectators: [],
        chat: [],
        cards: []
      }

      await this.redis.call("JSON.SET", `${newRoom.header.id}`, "$", JSON.stringify(newRoom));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getEntireRoom(roomId: string): Promise<RoomInterface | null> {
    const roomData = await this.redis.call("JSON.GET", roomId, "$") as string | null;

    if (!roomData) return null;

    return JSON.parse(roomData) as RoomInterface;
  }

  async getRoomHeaders(roomId: string): Promise<RoomHeader | null> {
    const roomData = await this.redis.call("JSON.GET", roomId, "$.header") as string | null;

    if (!roomData) return null;

    return JSON.parse(roomData) as RoomHeader;
  }

  async removeRoom(id: string): Promise<boolean> {
    const result = await this.redis.del(id);
    return result > 0; // Retorna true se a sala foi removida com sucesso
  }

  async validateRoomHeader(RoomHeader: RoomHeader): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async headerConstructor(RoomHeader: RoomHeader, roomCreator: decodedJwtToken): Promise<RoomHeader | null> {
    try {
      RoomHeader.id = generateNewId();
      RoomHeader.roomCreator = roomCreator;
      RoomHeader.roomName ??= roomCreator.nickname.toLowerCase().endsWith("s") ? `${roomCreator.nickname}' room` : `${roomCreator.nickname}'s room`;
      RoomHeader.startTime = null; //dayjs();
      RoomHeader.maxPlayer ??= 10;
      RoomHeader.roomPass ??= null;
      RoomHeader.startCoins ??= 2;
      RoomHeader.maxCoins ??= 20;
      RoomHeader.displayTime_withPossibleCounterPlays ??= 5;
      RoomHeader.displayTime_highRelevance ??= 3
      RoomHeader.displayTime ??= 2
      return RoomHeader;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }
}
