const { verifyDeadPlayerProtocol } = require('../../gameProtocols/deadPlayer');

function card_3 (playerMove, room) {
    // playerMove = {
    //     type: "playerMove",
    //     owner: playeruuid,
    //     content: {
    //       action: "card_3"
    //       attackedPlayer: attackedPlayer,
    //       card: card //0 ou 1
    //     }
    // };

    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);
    const attackedPlayer = room.players.find(player => player.header.nickname === playerMove.content.attackedPlayer);

    const displayTime = room.header.displayTime_withPossibleCounterPlays;

    moveOwner.coins -= room.calculateCardPrice(room.cards['3']);

    room.currentMove = {
        moveType: "card_3",
        player: moveOwner,
        attackedPlayer: attackedPlayer,
        card: playerMove.content.card
    };

    let currentMove_clients = { ...room.currentMove };
    currentMove_clients.player = currentMove_clients.player.header.nickname;
    currentMove_clients.attackedPlayer = currentMove_clients.attackedPlayer.header.nickname;
    
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

    //
    
    room.moveFunction = () => {
        room.currentMove = {
            moveType: "responseToCard_3",
            player: moveOwner,
            attackedPlayer: attackedPlayer,
            card: playerMove.content.card
        };

        let currentMove_clients = { ...room.currentMove };
        currentMove_clients.player = currentMove_clients.player.header.nickname;
        currentMove_clients.attackedPlayer = currentMove_clients.attackedPlayer.header.nickname;
        
        const payload = {
            type: "gameData",
            content: {
                currentMove: currentMove_clients,
                moveTimer: displayTime
            }
        };
        room.sendInfoForAllPlayers(payload);

        //

        room.moveFunction = () => {
            let killedCardIndex;
            if (attackedPlayer.cards[playerMove.content.card] == -1) {
                if (playerMove.content.card == 0) killedCardIndex = 1;
                if (playerMove.content.card == 1) killedCardIndex = 0;
            } else {
                killedCardIndex = playerMove.content.card;
            };

            room.deadDeck.push(attackedPlayer.cards[killedCardIndex]);
            attackedPlayer.cards[killedCardIndex] = -1;
            
            const payloadToAttackedPlayer = {
                type: "gameData",
                content: {
                    me: {
                        cardsInHand: attackedPlayer.cards
                    }
                }
            };
            attackedPlayer.header.socket.send(JSON.stringify(payloadToAttackedPlayer));
            
            const payload2 = {
                type: "gameData",
                content: {
                    deadDeck: room.deadDeck.length,
                    players: {}
                }
            };
            payload2.content.players[`${attackedPlayer.header.playerNum}`] = attackedPlayer.getPublicInfos();

            room.sendInfoForAllPlayers(payload2);

            //

            verifyDeadPlayerProtocol(attackedPlayer, room).then(() => {
                room.passTurnToNextPlayer(room.currentTurnOwner);
            });
        };

        room.playInTimeOut = setTimeout(room.moveFunction, displayTime * 1000);
    };

    //se ninguém contestar até o displayTime acabar: a ação se concretiza.
    room.playInTimeOut = setTimeout(room.moveFunction, displayTime * 1000);
};

module.exports = { card_3 };