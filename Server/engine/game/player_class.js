class Player {
    constructor (newPlayer, room) {
        this.header = {
            nickname: newPlayer.nickname,
            playeruuid: newPlayer.playeruuid,
            socket: newPlayer.socket,
            playerNum: (room.players.length) + 1,
          },
        this.cards = newPlayer.cards,
        this.coins = newPlayer.coins,
        this.invested = [
        //  o comprimento deste array, é a quantidade de moedas investida
        //  o número que estiver neste array, é a quantidade de turnos que a moeda permanecerá aqui
        ]
    };
    
};

module.exports = { Player };