const { validRequest } = require('../../lib/validations');
const { chatMessage_protocol } = require('../chat');
const { playerMove_protocol } = require('./player_Moves/identifyMove');

function socketOnMessage(socket, room) {
    socket.on('message', function message(data) {
        
        //função que retorna a "data" em formato de objeto, caso seja valido
        const result = validRequest(data, socket, room);        
        if (!result) return;

        //verifica se a requisição veio de um player vivo
        const moveOwner = room.players.find(player => player.header.playeruuid === result.owner);
        if(moveOwner.isAlive === false) return;

        switch (result.type) {
            case "msg_chat":
                chatMessage_protocol(result, room);
            break;
            case "playerMove":
                playerMove_protocol(result, room);
            break;

            default:
            break;
        }
        
    });
};


module.exports = { socketOnMessage };