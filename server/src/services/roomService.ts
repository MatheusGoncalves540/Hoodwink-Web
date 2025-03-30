import { Response } from "express";
import { HttpStatus, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { RoomHeader, RoomInterface } from "src/interfaces/roomInterface";
import { makeResponse } from "src/utils/makeResponse";
import { InjectRedis } from "@nestjs-modules/ioredis";

@Injectable()
export class RoomService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // Criar uma sala no Redis
  async createRoom(RoomHeader: RoomHeader): Promise<any> {
    try {
      await this.redis.set(`${RoomHeader.id}:header`, JSON.stringify(RoomHeader));
      return true;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getRoom(id: string): Promise<any> {
    const roomData = await this.redis.get(id);
    return roomData ? JSON.parse(roomData) : null; // Retorna null se não encontrar a sala
  }

  // Remover uma sala do Redis
  async removeRoom(id: string): Promise<boolean> {
    const result = await this.redis.del(id);
    return result > 0; // Retorna true se a sala foi removida com sucesso
  }

  private generateNewId(): string {
    // Geração de um ID único para a sala
    return `room_${Date.now()}`;
  }

  async validateCreatedRoom(
    res: Response,
    RoomHeader: RoomHeader
  ): Promise<true | Response> {
    try {
      return true;
    } catch (error) {
      console.error(error.message);
      return makeResponse(
        res,
        HttpStatus.BAD_REQUEST,
        "Erro ao criar a sala. Verifique as informações enviadas",
        true
      );
    }
  }

  ///////////////////////////////////////

  async findLastFifty(): Promise<any[]> {
    const keys = await this.redis.keys("user:*");
    const users = await Promise.all(keys.map((key) => this.redis.hgetall(key)));

    return users
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
      .slice(0, 50);
  }

  async findById(id: string): Promise<any | null> {
    const user = await this.redis.hgetall(`user:${id}`);
    return Object.keys(user).length ? user : null;
  }

  async findByEmail(email: string): Promise<any | null> {
    const keys = await this.redis.keys("user:*");
    for (const key of keys) {
      const user = await this.redis.hgetall(key);
      if (user.email === email) return user;
    }
    return null;
  }

  async findByNick(nickname: string): Promise<any | null> {
    const keys = await this.redis.keys("user:*");
    for (const key of keys) {
      const user = await this.redis.hgetall(key);
      if (user.nickname === nickname) return user;
    }
    return null;
  }

  async create(userData: any): Promise<any> {
    if (!userData.email) {
      throw new Error("Email é obrigatório");
    }

    const id = userData.id || Date.now().toString();
    const key = `user:${id}`;
    const user = { ...userData, createdAt: Date.now().toString() };

    await this.redis.hset(key, user);
    return user;
  }
}
