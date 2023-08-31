const { allowedMessage } = require('../lib/validations');

//manda para o player que entrou as mensagens que estão guardadas no chat
function BringPastMessages(room, playeruuid) {
    const roomMessages = room.chat;
    const playerSocket = room.players.find(player => player.header.playeruuid === playeruuid).header.socket;

    let payload = {
        "type": "msg_chat",
        "msgs": []
    };
    if (playerSocket) {
        try {
            roomMessages.forEach(message => {
                payload.msgs.push({
                    "time": message.time,
                    "content": message.content,
                    "owner": message.ownerNick
                });
            });
            playerSocket.send(JSON.stringify(payload));
        } catch { };
    };
};

function chatMessage_protocol(result, room) {
    if (allowedMessage(result, room)) {
        try {
            //encontra o nick de quem mandou a mensagem, pelo uuid
            const messageOwnerNick = room.players.find(player => player.header.playeruuid === result.owner).header.nickname;
            const elapsedTime = room.elapsedTime();
            const payload = {
                "type": "msg_chat",
                "msgs": [{
                    "time":[elapsedTime.hours, elapsedTime.minutes, elapsedTime.seconds],
                    "content": result.content,
                    "owner": messageOwnerNick
                }]
            };
            room.sendInfoForAllPlayers(payload);
            room.recordMessageInChat(result, elapsedTime, messageOwnerNick);
        } catch (error) {
            console.log(error);
        };
    };
};


module.exports = { BringPastMessages, chatMessage_protocol };