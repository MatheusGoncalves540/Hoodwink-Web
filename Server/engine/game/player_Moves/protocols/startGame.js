const { shuffle } = require('../../../../lib/functions');


function startGame(room) {
    if (room.turn !== 0) return;
    
    room.turn = 1;
    room.header.startTime = Date.now();

    room.currentTurnOwner = room.players.find(player => player.header.playerNum === 1);
    
    room.currentMove = {
        moveType: "waitingFirstMove",
        player: room.currentTurnOwner
    };

    shuffle(room.aliveDeck);

    room.players.forEach(player => {
        while (player.cards.length != 2) {
            player.cards.push(room.aliveDeck.pop());
        };
    });

    const currentMove_clients = { ...room.currentMove };
    currentMove_clients.player = currentMove_clients.player.header.nickname;

    //escolhe as cartas pros players
    room.players.forEach(player => {
        const payload = {
            type: "gameData",
            content: {
                time: room.elapsedTime(),
                turn: room.turn,
                aliveDeck: room.aliveDeck.length,
                deadDeck: room.deadDeck.length,
                currentMove: currentMove_clients,
                currentTurnOwner: room.currentTurnOwner.header.nickname,
                me: {
                    cardsInHand: player.cards
                },
                players: {}
            }
        };

        room.players.forEach(player_ => {
            payload.content.players[`${player_.header.playerNum}`] = {
                nick: player_.header.nickname,
                playerNum: player_.header.playerNum,
                coins: player_.coins,
                playerCards: [
                    player_.cards[0] != -1 ? true : false, //posição 0 no array: carta esquerda | true se estiver viva, false se estiver morta
                    player_.cards[1] != -1 ? true : false //posição 0 no array: carta esquerda  | id de carta morta: -1
                ],
                invested: player_.invested,
                usedCards: player_.usedCards,
                connected: player_.header.socket !== null ? true : false
            };
        });

        player.header.socket.send(JSON.stringify(payload));
    });

    //diz que a ação de iniciar o jogo, foi concluída, e o server está pronto para receber o próximo comando
    room.alreadyPlayed = false;
};

module.exports = { startGame };