import dayjs from "dayjs";
import { decodedJwtToken } from "./decodedJwtToken";

export interface RoomInterface {
    header: RoomHeader;
    gameOver: boolean;
    turn: number;
    currentTurnOwner: string | null;
    tax: number;
    currentMove: Record<string, any>;
    playersWhoWantsToSkip: string[];
    aliveDeck: number[];
    deadDeck: number[];
    players: PlayerInterface[];
    spectators: string[];
    chat: ChatMessage[];
    cards: CardInterface[];
}

export interface RoomHeader {
    id: string;
    roomName: string;
    roomCreator: decodedJwtToken;
    maxPlayer: number;
    roomPass: string | null;
    startTime: dayjs.Dayjs | null;
    startCoins: number;
    maxCoins: number;
    displayTime_withPossibleCounterPlays: number;
    displayTime_highRelevance: number;
    displayTime: number;
}

export interface PlayerInterface {
    //TODO
}

export interface ChatMessage {
    //TODO
}

export interface CardInterface {
    //TODO
}