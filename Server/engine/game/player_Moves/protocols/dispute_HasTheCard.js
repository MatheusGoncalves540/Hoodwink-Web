const { verifyDeadPlayerProtocol } = require('./deadPlayer');

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
    if (playerMove.owner !== room.currentMove.disputedPlayer.header.playeruuid) return false;

    const disputedPlayer = room.players.find(player => player.header.playeruuid === playerMove.owner);
    const playerWhoDisputed = room.players.find(player => player.header.nickname === playerMove.content.attackedPlayer);

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

    setTimeout(()=> {
        room.deadDeck.push(playerWhoDisputed.cards[playerMove.content.card]);
        playerWhoDisputed.cards[playerMove.content.card] = -1;
        
        const payloadToPlayerWhoDisputed = {
            type: "gameData",
            content: {
                me: {
                    cardsInHand: playerWhoDisputed.cards
                }
            }
        };
        playerWhoDisputed.header.socket.send(JSON.stringify(payloadToPlayerWhoDisputed));
        //
        const payload2 = {
            type: "gameData",
            content: {
                deadDeck: room.deadDeck,
                players: {}
            }
        };
        payload2.content.players[`${playerWhoDisputed.header.playerNum}`] = playerWhoDisputed.getPublicInfos();

        room.sendInfoForAllPlayers(payload2);

        //

        verifyDeadPlayerProtocol(playerWhoDisputed, room);

    }, displayTime * 1000);
};

module.exports = { dispute_hasTheCard };