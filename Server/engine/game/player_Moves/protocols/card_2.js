const { getPlayerNickFromCurrentMove } = require('../../../../lib/functions');

function card_2(playerMove, room) {
    // playerMove = {
    //     type: "playerMove",
    //     owner: playeruuid,
    //     content: {
    //       action: "card_2"
    //     }
    // };
    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);

    //muda o currentMove
    room.currentMove = {
        moveType: "card_2",
        player: moveOwner
    };

    const currentMove_clients = room.currentMove;
    currentMove_clients.player = getPlayerNickFromCurrentMove(currentMove_clients);

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


    room.moveFunction = () => {
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
        room.sendInfoForAllPlayers(payload);
        room.playersWhoWantsToSkip.length = 0;
        room.passTurnToNextPlayer(moveOwner);
    };

    //se ninguém contestar até o displayTime acabar: a ação se concretiza.
    room.playInTimeOut = setTimeout(room.moveFunction, displayTime * 1000);
};

module.exports = { card_2 };