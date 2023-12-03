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
    //  o número do elemento neste array, é a quantidade de turnos que a moeda permanecerá aqui
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

  getPublicInfos() {
    const publicInfos = {
      nick: this.header.nickname,
      playerNum: this.header.playerNum,
      coins: this.coins,
      playerCards: [
        this.cards[0] != -1 ? true : false, //posição 0 no array: carta esquerda | true se estiver viva, false se estiver morta
        this.cards[1] != -1 ? true : false //posição 0 no array: carta esquerda  | id de carta morta: -1
      ],
      invested: this.invested,
      usedCards: this.usedCards,
      isAlive: this.isAlive,
      connected: this.header.socket !== null ? true : false
    };
  
    return publicInfos;
  };

  // Função pra rodar cada vez que uma carta morrer pra ver se o player morreu
  isDead(){
    const initialValue = 0;
    const sumOfCards = this.cards.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);

    if (sumOfCards === -2){
      this.isAlive = false;
      return true;
    } else {
      return false;
    };

  };

};

module.exports = { Player };