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