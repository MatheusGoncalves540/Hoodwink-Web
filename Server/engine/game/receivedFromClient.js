const { validRequest } = require('../../lib/validations');
const { chatMessage_protocol } = require('../chat');
const { playerMove_protocol } = require('./player_Moves/identifyMove');

function socketOnMessage(socket, room) {
    socket.on('message', function message(data) {
        //função que retorna a "data" em formato de objeto, caso seja valido
        const result = validRequest(data, socket, room);
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