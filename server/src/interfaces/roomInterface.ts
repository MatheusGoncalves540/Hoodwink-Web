import dayjs from "dayjs";

export interface RoomInterface {
    header: RoomHeader;
    gameOver: boolean;
    turn: number;
    currentTurnOwner: string | null;
    tax: number;
    currentMove: {};
    playersWhoWantsToSkip: string[];
    aliveDeck: number[];
    deadDeck: number[];
    players: any[];
    spectators: string[];
    chat: {}[];
    cards: {}[];
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
