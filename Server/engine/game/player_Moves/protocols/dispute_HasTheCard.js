const { verifyDeadPlayerProtocol } = require('../../gameProtocols/deadPlayer');

function dispute_hasTheCard(playerMove, room) {
    //TODO fazer com que a habilidade da carta seja realizada caso ele tinha a carta
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
    const playerWhoDisputed = room.players.find(player => player.header.nickname === playerMove.content.attackedPlayer);

    //validações
    if (playerMove.owner !== room.currentMove.disputedPlayer.header.playeruuid) return false;
    if (playerWhoDisputed.cards[playerMove.content.card] == -1) return false;

    const displayTime = room.header.displayTime_withPossibleCounterPlays;

    room.currentMove = {
        moveType: 'responseToHasTheCard',
        player: disputedPlayer,
        playerWhoDisputed: playerWhoDisputed,
        card: playerMove.content.card
    };

    let currentMove_clients = { ...room.currentMove };
    currentMove_clients.player = currentMove_clients.player.header.nickname;
    currentMove_clients.playerWhoDisputed = currentMove_clients.playerWhoDisputed.header.nickname;
    
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
        if (playerWhoDisputed.cards[playerMove.content.card] == -1) {
            if (playerMove.content.card == 0) killedCardIndex = 1;
            if (playerMove.content.card == 1) killedCardIndex = 0;
        } else {
            killedCardIndex = playerMove.content.card;
        };

        room.deadDeck.push(playerWhoDisputed.cards[killedCardIndex]);
        playerWhoDisputed.cards[killedCardIndex] = -1;
        
        const payloadToPlayerWhoDisputed = {
            type: "gameData",
            content: {
                me: {
                    cardsInHand: playerWhoDisputed.cards
                }
            }
        };
        playerWhoDisputed.header.socket.send(JSON.stringify(payloadToPlayerWhoDisputed));
        
        const payload2 = {
            type: "gameData",
            content: {
                deadDeck: room.deadDeck.length,
                players: {}
            }
        };
        payload2.content.players[`${playerWhoDisputed.header.playerNum}`] = playerWhoDisputed.getPublicInfos();

        room.sendInfoForAllPlayers(payload2);

        //

        verifyDeadPlayerProtocol(playerWhoDisputed, room).then(() => {
            if (room.moveFunction_counterPlay) {
                room.moveFunction_counterPlay();
            } else { //TODO verificar funcionalidade
                room.moveFunction();
            };
        });        

    }, displayTime * 1000);
};

module.exports = { dispute_hasTheCard };