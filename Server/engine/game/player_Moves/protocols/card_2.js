

function card_2(playerMove, room) {
    // playerMove = {
    //     type: "playerMove",
    //     owner: playeruuid,
    //     content: {
    //       action: "card_2"
    //     }
    // };
    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);

    moveOwner.coins -= room.calculateCardPrice(room.cards["2"]);

    //muda o currentMove
    room.currentMove = {
        moveType: "card_2",
        player: moveOwner
    };

    let currentMove_clients = { ...room.currentMove };
    currentMove_clients.player = currentMove_clients.player.header.nickname;

    //tempo em segundos que será mostrado no "currentMove"
    const displayTime = room.header.displayTime_withPossibleCounterPlays;

    const payloadToOwner = {
        type: "gameData",
        content: {
            currentMove: currentMove_clients,
            moveTimer: displayTime,
            me: {
                coins: moveOwner.coins
            }
        }
    };
    moveOwner.header.socket.send(JSON.stringify(payloadToOwner));
    
    const payload = {
        type: "gameData",
        content: {
            currentMove: currentMove_clients,
            moveTimer: displayTime,
            players: {}
        }
    };
    payload.content.players[`${moveOwner.header.playerNum}`] = {
        coins: moveOwner.coins
    };
    room.sendInfoForAllPlayers(payload);


    room.moves.functions.push([() => {
        room.tax --;
        
        if (room.cards["2"].doubled < 2) room.cards["2"].doubled ++;
        room.cards["2"].usedThisTurn = true;
        room.cards["2"].roundsUntilCheaper = 3;

        const payload = {
            type: "gameData",
            content: {
                tax: room.tax,
                cards: {
                    "2": room.cards["2"]
                }
            }
        };

        room.alertModifyTax('decreased').then(() => {
            room.sendInfoForAllPlayers(payload);
            room.playersWhoWantsToSkip.length = 0;
            room.passTurnToNextPlayer(room.currentTurnOwner);
        });
    }, true]);

    //se ninguém contestar até o displayTime acabar: a ação se concretiza.
    room.playInTimeOut = setTimeout(room.moves.functions[room.moves.functions.length-1][0], displayTime * 1000);
};

module.exports = { card_2 };