function defaultHeader(idNewRoom, roomName, maxPlayer, roomPass,
    startCoins=100, maxCoins=200, displayTime_withPossibleCounterPlays=10, displayTime_highRelevance=5,
    displayTime=2) {
    return {
      roomId: idNewRoom,
      roomName: roomName,
      maxPlayer: maxPlayer,
      roomPass: roomPass,
      startTime: undefined,
      startCoins: startCoins, //startCoins,
      maxCoins: maxCoins, //maxCoins,
      displayTime_withPossibleCounterPlays: displayTime_withPossibleCounterPlays,
      displayTime_highRelevance: displayTime_highRelevance,
      displayTime: displayTime
    };
};

function defaultChat() {
    [
        { //estrutura de mensagem do chat
            time: [0, 0, 0],
            owner: "Servidor",
            ownerNick: "Servidor",
            content: "Sala criada!",
        },
    ];
};

module.exports = { defaultHeader, defaultChat };