

function dispute(playerMove, room) {
    // playerMove = {
    //     type: "playerMove",
    //     owner: playeruuid,
    //     content: {
    //       action: "dispute"
    //     }
    // };
    // primeira parte
    if (!room.currentMove.moveType.includes('card_')) return false;

    clearTimeout(room.playInTimeOut);
    room.playersWhoWantsToSkip.length = 0;

    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);
    const disputedPlayer = room.players.find(player => player.header.playeruuid === room.currentMove.player.header.playeruuid);
    const disputedCardId = room.currentMove.moveType[room.currentMove.moveType.length - 1];

    const displayTime = room.header.displayTime_highRelevance;

    room.currentMove = {
        moveType: 'dispute',
        player: moveOwner,
        disputedPlayer: disputedPlayer,
        disputedCard: disputedCardId
    };

    let currentMove_clients = { ...room.currentMove };
    currentMove_clients.player = currentMove_clients.player.header.nickname;
    currentMove_clients.disputedPlayer = currentMove_clients.disputedPlayer.header.nickname;
    
    const payload1 = {
        type: "gameData",
        content: {
            currentMove: currentMove_clients,
            moveTimer: displayTime,
        }
    };
    room.sendInfoForAllPlayers(payload1);

    // segunda parte
    const disputedPlayer_hasTheDisputedCard = disputedPlayer.cards.includes(parseInt(`${disputedCardId}`));

    let actionTaken;

    if (disputedPlayer_hasTheDisputedCard) {
        actionTaken = () => {
            room.currentMove = {
                moveType: 'dispute_hasTheCard',
                player: moveOwner,
                disputedPlayer: disputedPlayer
            };

            currentMove_clients = { ...room.currentMove };
            currentMove_clients.player = currentMove_clients.player.header.nickname;
            currentMove_clients.disputedPlayer = currentMove_clients.disputedPlayer.header.nickname;
            
            const payload2 = {
                type: "gameData",
                content: {
                    currentMove: currentMove_clients,
                    moveTimer: room.header.displayTime_withPossibleCounterPlays //TODO escolha automática aleatória depois desse tempo
                }
            };
            room.sendInfoForAllPlayers(payload2);
        };
    } else {
        actionTaken = () => {
            room.currentMove = {
                moveType: 'dispute_doesNotHasTheCard',
                player: moveOwner,
                disputedPlayer: disputedPlayer
            };

            currentMove_clients = { ...room.currentMove };
            currentMove_clients.player = currentMove_clients.player.header.nickname;
            currentMove_clients.disputedPlayer = currentMove_clients.disputedPlayer.header.nickname;

            const payload2 = {
                type: "gameData",
                content: {
                    currentMove: currentMove_clients,
                    moveTimer: room.header.displayTime_withPossibleCounterPlays //TODO escolha automática aleatória depois desse tempo
                }
            };
            room.sendInfoForAllPlayers(payload2);
        };
    };

    setTimeout(actionTaken, displayTime * 1000);

};

module.exports = { dispute };