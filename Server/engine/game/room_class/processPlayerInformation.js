function BringGameInfos(socket, room) {
  const connectedPlayer = room.players.find(player => player.header.playeruuid === socket.context.playeruuid);
  const time = room.elapsedTime();
  let currentMove_clients = {};

  if (Object.keys(room.currentMove).length !== 0) {
    currentMove_clients = { ...room.currentMove };
    currentMove_clients.player = currentMove_clients.player.header.nickname;
    if ("disputedPlayer" in currentMove_clients) currentMove_clients.disputedPlayer = currentMove_clients.disputedPlayer.header.nickname;
  };

  let payload = {
    type: "gameData",
    content: {
      roomName: room.header.roomName,
      turn: room.turn,
      time: time,
      tax: room.tax,
      maxCoins: room.header.maxCoins,
      currentTurnOwner: room.currentTurnOwner !== undefined ? room.currentTurnOwner.header.nickname : room.currentTurnOwner,
      currentMove: currentMove_clients,
      aliveDeck: room.aliveDeck.length,
      deadDeck: room.deadDeck.length,
      cards: room.cards,

      me: {
        coins: connectedPlayer.coins,
        cardsInHand: [connectedPlayer.cards[0], connectedPlayer.cards[1]],
        invested: connectedPlayer.invested,
        playerNum: connectedPlayer.header.playerNum
      },

      players: {}
    }
  };

  room.players.forEach(player => {
    payload.content.players[`${player.header.playerNum}`] = player.getPublicInfos();
  });

  socket.send(JSON.stringify(payload));
};

//

function recordMessageInChat(message, elapsedTime, messageOwnerNick, room) {
  if (room.chat.length >= 20) room.chat.shift();

  room.chat.push({
    "time": [elapsedTime.hours, elapsedTime.minutes, elapsedTime.seconds],
    "owner": message.owner,
    "ownerNick": messageOwnerNick,
    "content": message.content
  });
};

//

function sendInfoForAllPlayers(payload, room) {
  payload = JSON.stringify(payload);

  room.players.forEach(player => {
    try {
      player.header.socket.send(payload);
    } catch { };
  });
};

//

function elapsedTime(room) {
  if (room.turn !== 0) {
    const secondsPassTotal = Math.floor((Date.now() - room.header.startTime) / 1000);
    const minutesPassTotal = Math.floor(secondsPassTotal / 60);
    const hoursPassTotal = Math.floor(minutesPassTotal / 60);
    return {
      startTime: room.header.startTime,
      seconds: secondsPassTotal - (minutesPassTotal * 60),
      minutes: minutesPassTotal - (hoursPassTotal * 60),
      hours: hoursPassTotal
    };
  } else {
    return {
      startTime: 0,
      seconds: 0,
      minutes: 0,
      hours: 0
    };
  };
}
module.exports = { BringGameInfos, recordMessageInChat, sendInfoForAllPlayers, elapsedTime };