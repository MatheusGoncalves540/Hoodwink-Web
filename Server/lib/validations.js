//valida se o nome passado é valido
function validateName(nickname) {

    if (!nickname) return false;

    if (nickname.length > 15) return false;

    if (nickname.length < 3) return false;

    if (nickname === 'server') return false;

    return true;
};

//verifica se as senhas conhecidem
function validateRoomPass(room, roomPass_byUser) {

    if (room.header.roomPass !== roomPass_byUser) return false;

    return true;
};

//verifica se existe um player com o uuid fornecido dentro da sala
function ValidateAlreadyPlayerInRoom(room, playeruuid, nickname) {

    const playerAlreadyInRoom = room.players.find(player => player.uuidPlayer === playeruuid || player.nickname === nickname);

    if (!playerAlreadyInRoom) return true;

    if (playerAlreadyInRoom.socket !== null) return false;

    return true;
}

//Valida se com os dados passados, é permitida a entrada
function ValidateEntry(nickname, room, roomPass, playeruuid, socketOrExpress) {
    if (socketOrExpress === "express") {
        if (!validateName(nickname)) return false;

        if (!validateRoomPass(room, roomPass)) return false;

        return true;

    } else if (socketOrExpress === "socket") {
        if (!validateName(nickname)) return false;

        if (!validateRoomPass(room, roomPass)) return false;

        if (room.players.length >= room.header.maxPlayer) return false;

        if (!ValidateAlreadyPlayerInRoom(room, playeruuid, nickname)) return false;

        return true;
    };

};

//valida se com os dados passados, pode-se criar uma sala
function validateCreatedRoom(nickname, roomName, maxPlayer, roomPass) {
    //nome do player tem que se enquadrar nos padrões de nome
    if (!validateName(nickname)) return false;

    //nome da sala tem que se enquadrar nos padrões de nome
    if (!validateName(roomName)) return false;

    //não pode ter mais que 10 players ou menos que 2
    if (maxPlayer > 10 || maxPlayer < 2) return false;

    //senha da sala não pode ter mais que 30 caracteres
    if (roomPass.length > 30) return false;

    return true;
};

//verifica se a mensagem passada é permitida
function allowedMessage(message, room) {

    //se o dono da mensagem for espectador
    if (room.spectators.find(spectator => spectator.uuidPlayer === message['owner'])) return false;

    if (!message['content']) return false;

    if (message['content'].length > 50) return false;

    if (message['content'].trim() === '') return false;

    return true;
};

function validRequest(data, socket) {
    try {
        return JSON.parse(data);
    } catch (error) {
        if (socket) socket.send(msg.errors.invldReq);
        return;
    };
};

module.exports = { ValidateEntry, validateCreatedRoom, allowedMessage, validRequest };