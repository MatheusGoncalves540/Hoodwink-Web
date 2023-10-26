class Player {
    constructor (newPlayer, room) {
        this.header = {
            nickname: newPlayer.nickname,
            playeruuid: newPlayer.playeruuid,
            socket: newPlayer.socket,
            playerNum: (room.players.length) + 1
        };
        this.cards = [];
        this.isAlive = true;
        this.protectedCard = undefined; //guarda o index da carta protegida (undefined se não há carta protegida)
        this.usedCards = {};
        this.coins = newPlayer.coins;
        this.invested = [
        //  o comprimento deste array, é a quantidade de moedas investida
        //  o número que estiver neste array, é a quantidade de turnos que a moeda permanecerá aqui
        ];
        this.possiblesMoves = {
            card: {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false,
                7: false,
                8: false,
                9: false,
                11: false,
                12: false
            },
            pass_basic: false,
            pass: false,
            dispute: false,
            takeCoin: false,
            killByHands: false,
            switchCardsInHand: false
        },
        this.passed = false;
    };
    
};

module.exports = { Player };