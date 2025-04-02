import dayjs from "dayjs";

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
    maxPlayer: number;
    roomPass?: string;
    startTime?: dayjs.Dayjs;
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