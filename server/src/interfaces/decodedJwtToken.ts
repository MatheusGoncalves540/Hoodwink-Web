export interface decodedJwtToken {
    id: string;
    nickname: string;
    iat?: number;
    exp?: number;
}
