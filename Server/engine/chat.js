const { allowedMessage } = require('../lib/validations');

//manda para o player que entrou as mensagens que estão guardadas no chat
function BringPastMessages(room, uuidPlayer) {
    const roomMessages = room.chat;
    const playerSocket = room.players.find(player => player.header.uuidPlayer === uuidPlayer).header.socket;

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
        //encontra o nick de quem mandou a mensagem, pelo uuid
        const messageOwnerNick = room.players.find(player => player.header.uuidPlayer === result.owner).header.nickname;
        const elapsedTime = room.elapsedTime();

        room.players.forEach(player => {
            try {
                const payload = {
                    "type": "msg_chat",
                    "msgs": [{
                        "time":[elapsedTime.hours, elapsedTime.minutes, elapsedTime.seconds],
                        "content": result.content,
                        "owner": messageOwnerNick
                    }]
                };
                player.header.socket.send(JSON.stringify(payload));
            } catch { };
        });
        room.recordMessageInChat(result, elapsedTime, messageOwnerNick);
    };
};


module.exports = { BringPastMessages, chatMessage_protocol };