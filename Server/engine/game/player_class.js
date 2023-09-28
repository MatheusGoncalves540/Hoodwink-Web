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
    };
    
};

module.exports = { Player };