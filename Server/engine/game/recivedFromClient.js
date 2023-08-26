const { validRequest } = require('../../lib/validations');
const { chatMessage_protocol } = require('../chat');

function socketOnMessage(socket, room) {
    socket.on('message', function message(data) {
        //função que retorna a "data" em fomato de objeto, caso seja valido
        const result = validRequest(data, socket);

        chatMessage_protocol(result, room);
    });
};


module.exports = { socketOnMessage };