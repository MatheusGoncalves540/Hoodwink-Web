function card_4(playerMove, room) {
    // playerMove = {
    //     type: "playerMove",
    //     owner: playeruuid,
    //     content: {
    //       action: "card_4"
    //     }
    // };

    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);
    
    //muda o currentMove
    room.currentMove = {
        moveType: "card_4",
        player: moveOwner
    };

    const currentMove_clients = { ...room.currentMove };
    currentMove_clients.player = currentMove_clients.player.header.nickname;

    //tempo em segundos que será mostrado no "currentMove"
    const displayTime = room.header.displayTime_withPossibleCounterPlays;

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
        if ((room.cards['4'].amountReceived + room.tax) < room.cards['4'].taxMinimum) {
            moveOwner.coins += room.cards['4'].taxMinimum;
        } else {
            moveOwner.coins += room.cards['4'].amountReceived + room.tax;
        };  
    
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
    
        const payload2 = {
            type: "gameData",
            content: {
                currentMove: currentMove_clients,
                moveTimer: displayTime,
                players: {}
            }
        };
    
        payload2.content.players[`${moveOwner.header.playerNum}`] = {
            coins: moveOwner.coins
        };
        
        room.sendInfoForAllPlayers(payload2);
        room.passTurnToNextPlayer(room.currentTurnOwner);
    };

    room.playInTimeOut = setTimeout(room.moveFunction, displayTime * 1000);
};

module.exports = { card_4 };