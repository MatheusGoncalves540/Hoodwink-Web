function BringPastMessages(room, uuidPlayer) {
    const roomMessages = room.chat;
    const playerSocket = room.players.find(player => player.uuidPlayer === uuidPlayer).socket;

    if (playerSocket) {
        try {
            roomMessages.forEach(message => { 
                //manda para o player que entrou, as mensagens que estão guardadas no chat
                playerSocket.send(JSON.stringify({
                    "type":"msg_chat",
                    "content":message.content,
                    "owner": message.ownerNick,
                }));
            });
        } catch {};
    };
};

module.exports = {BringPastMessages};