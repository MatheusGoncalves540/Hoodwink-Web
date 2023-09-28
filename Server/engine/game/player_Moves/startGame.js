//TODO envia todas as informações necessárias quando o jogo começar.
const msgServer = require('../../../lib/languages/messages.json')['ptbr'];
const { shuffle } = require('../../../lib/functions');

function startGame(room) {
    if (room.turn !== 0) return;
    
    room.turn = 1;
    room.header.startTime = Date.now();
    room.currentTurnOwner = room.players.find(player => player.header.playerNum === 1);
    room.currentMove = `${msgServer.game.playerTurn}`+`${room.currentTurnOwner.header.nickname}`
    shuffle(room.aliveDeck);

    room.players.forEach(PLAYER__ => {
        while (PLAYER__.cards.length != 2) {
            PLAYER__.cards.push(room.aliveDeck.pop());
        };
    });
    //escolhe as cartas pros players
    room.players.forEach(player => {
        const payload = {
            type: "gameData",
            content: {
                time: room.elapsedTime(),
                turn: room.turn,
                aliveDeck: room.aliveDeck.length,
                deadDeck: room.deadDeck.length,
                currentMove: room.currentMove,
                currentTurnOwner: room.currentTurnOwner.header.nickname,
                me: {
                    cardsInHand: player.cards
                },
                players: {}
            }
        };

        room.players.forEach(player_ => {
            payload.content.players[`${player_.header.playerNum}`] = {
                num_cards: player_.cards.length,
                coins: player_.coins,
            }
        });

        player.header.socket.send(JSON.stringify(payload));
    });

    //diz que a ação de iniciar o jogo, foi concluída, e o server está pronto para receber o próximo comando
    room.alreadyPlayed = false;
};

module.exports = { startGame };