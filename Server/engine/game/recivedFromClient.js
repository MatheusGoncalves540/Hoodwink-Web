const { allowedMessage } = require('../../lib/validations');

function socketOnMessage(socket, room) {
    socket.on('message', function message(data) {
        const result = JSON.parse(data);

        if (allowedMessage(result['content'])) {
            //encontra o nick de quem mandou a mensagem, pelo uuid
            const messageOwnerNick = room.players.find(player => player.uuidPlayer === result.owner).nickname;

            room.players.forEach(player => {
                try {
                    player.socket.send(JSON.stringify({
                        "type": "msg_chat",
                        "content": result.content,
                        "owner": messageOwnerNick
                    }));

                } catch { };
            });
            room.chat.push({
                time: [0, 0, 0], //TODO incrementar o "horario" em cada mensagem
                owner: result.owner,
                ownerNick: messageOwnerNick,
                content: result.content
            })
        };
    });
}


module.exports = { socketOnMessage };