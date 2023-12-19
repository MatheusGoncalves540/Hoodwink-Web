const { verifyDeadPlayerProtocol } = require('../../gameProtocols/deadPlayer');

function dispute_doesNotHasTheCard(playerMove, room) {
    // const payload = {
    //     type: "playerMove",
    //     owner: playeruuid,
    //     content: {
    //       action: "dispute_doesNotHasTheCard",
    //       attackedPlayer: disputedPlayer,
    //       card: //0 ou 1
    //     }
    // };
    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);
    const disputedPlayer = room.players.find(player => player.header.nickname === playerMove.content.attackedPlayer);

    //validações
    if (playerMove.owner !== room.currentMove.player.header.playeruuid) return false;
    if (disputedPlayer.cards[playerMove.content.card] == -1) return false;

    const displayTime = room.header.displayTime_withPossibleCounterPlays;

    room.currentMove = {
        moveType: 'responseToDoesNotHasTheCard',
        player: moveOwner,
        disputedPlayer: disputedPlayer,
        card: playerMove.content.card
    };

    let currentMove_clients = { ...room.currentMove };
    currentMove_clients.player = currentMove_clients.player.header.nickname;
    currentMove_clients.disputedPlayer = currentMove_clients.disputedPlayer.header.nickname;
    
    const payload = {
        type: "gameData",
        content: {
            currentMove: currentMove_clients,
            moveTimer: displayTime
        }
    };
    room.sendInfoForAllPlayers(payload);

    //

    room.playInTimeOut = setTimeout(()=> {
        let killedCardIndex;
        if (disputedPlayer.cards[playerMove.content.card] == -1) {
            if (playerMove.content.card == 0) killedCardIndex = 1;
            if (playerMove.content.card == 1) killedCardIndex = 0;
        } else {
            killedCardIndex = playerMove.content.card;
        };

        room.deadDeck.push(disputedPlayer.cards[killedCardIndex]);
        disputedPlayer.cards[killedCardIndex] = -1;
        
        const payloadToDisputedPlayer = {
            type: "gameData",
            content: {
                me: {
                    cardsInHand: disputedPlayer.cards
                }
            }
        };
        disputedPlayer.header.socket.send(JSON.stringify(payloadToDisputedPlayer));
        //
        const payload2 = {
            type: "gameData",
            content: {
                deadDeck: room.deadDeck.length,
                players: {}
            }
        };
        payload2.content.players[`${disputedPlayer.header.playerNum}`] = disputedPlayer.getPublicInfos();

        room.sendInfoForAllPlayers(payload2);

        //

        verifyDeadPlayerProtocol(disputedPlayer, room).then(() => {
            if (room.moveFunction_counterPlay) {
                room.moveFunction();
            } else { //TODO verificar funcionalidade
                room.passTurnToNextPlayer(room.currentTurnOwner);
            };
            
        });   

    }, displayTime * 1000);
};

module.exports = { dispute_doesNotHasTheCard };
