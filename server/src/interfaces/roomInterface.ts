export interface Room {
    header: RoomHeader;
    gameOver: boolean;
    turn: number;
    currentTurnOwner?: string;
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

interface RoomHeader {
    roomId: string;
    roomName: string;
    maxPlayer: number;
    roomPass?: string;
    startTime?: number;
    startCoins: number;
    maxCoins: number;
    displayTime_withPossibleCounterPlays: number;
    displayTime_highRelevance: number;
    displayTime: number;
}
