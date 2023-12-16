function defaultHeader(idNewRoom, roomName, maxPlayer, roomPass,
    startCoins=100, maxCoins=200, displayTime_withPossibleCounterPlays=4, displayTime_highRelevance=3,
    displayTime=2) {
    return {
      roomId: idNewRoom,
      roomName: roomName,
      maxPlayer: maxPlayer,
      roomPass: roomPass,
      startTime: undefined,
      startCoins: startCoins,
      maxCoins: maxCoins,
      displayTime_withPossibleCounterPlays: displayTime_withPossibleCounterPlays,
      displayTime_highRelevance: displayTime_highRelevance,
      displayTime: displayTime
    };
};

function defaultChat() {
    return [
        { //estrutura de mensagem do chat
            time: [0, 0, 0],
            owner: "Servidor",
            ownerNick: "Servidor",
            content: "Sala criada!",
        },
    ];
};

module.exports = { defaultHeader, defaultChat };