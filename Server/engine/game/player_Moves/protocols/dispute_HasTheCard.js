const { verifyDeadPlayerProtocol } = require('../../gameProtocols/deadPlayer');

function dispute_hasTheCard(playerMove, room) {
    // const payload = {
    //     type: "playerMove",
    //     owner: playeruuid, <-- disputedPlayer
    //     content: {
    //       action: "dispute_hasTheCard",
    //       attackedPlayer: PlayerWhoDisputed,
    //       card: //0 ou 1
    //     }
    // };
    const disputedPlayer = room.players.find(player => player.header.playeruuid === playerMove.owner);
    const attackedPlayer = room.players.find(player => player.header.nickname === playerMove.content.attackedPlayer);

    //validações
    if (playerMove.owner !== room.currentMove.disputedPlayer.header.playeruuid) return false;
    if (attackedPlayer.cards[playerMove.content.card] == -1) return false;

    const displayTime = room.header.displayTime_withPossibleCounterPlays;

    room.currentMove = {
        moveType: 'kamikazeResponseToHasTheCard',
        player: disputedPlayer,
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

    room.playInTimeOut = setTimeout(async ()=> {
        let killedCardIndex;
        if (attackedPlayer.cards[playerMove.content.card] == -1) {
            if (playerMove.content.card == 0) killedCardIndex = 1;
            if (playerMove.content.card == 1) killedCardIndex = 0;
        } else {
            killedCardIndex = playerMove.content.card;
        };

        room.deadDeck.push(attackedPlayer.cards[killedCardIndex]);
        attackedPlayer.cards[killedCardIndex] = -1;
        
        const payloadToPlayerWhoDisputed = {
            type: "gameData",
            content: {
                me: {
                    cardsInHand: attackedPlayer.cards
                }
            }
        };
        attackedPlayer.header.socket.send(JSON.stringify(payloadToPlayerWhoDisputed));
        
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

        await verifyDeadPlayerProtocol(attackedPlayer, room);

        const functionsAmountRemaining_toVerify = room.moves.functions.length;
        const verified = 0;
        
        while (verified != functionsAmountRemaining_toVerify) {
            if (room.moves.functions[verified][1]) {
                room.moves.functions[verified][0]();
                functionsAmountRemaining_toVerify = 0;
            } else {
                functionsAmountRemaining_toVerify --;
                verified ++;
            };
        };
        if (verified == functionsAmountRemaining_toVerify) room.passTurnToNextPlayer(room.currentTurnOwner);
    }, displayTime * 1000);
};

module.exports = { dispute_hasTheCard };