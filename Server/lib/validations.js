//valida se o nome passado é valido
function validateName(nickname, room) {
    nickname = nickname.trim();


    if (!nickname) return false;

    if (nickname.length > 15) return false;

    if (nickname.length < 3) return false;

    if (room !== undefined) {
        const PlayerNickAlreadyUsed = room.players.find(player => player.header.nickname === nickname);
        
        if (PlayerNickAlreadyUsed && PlayerNickAlreadyUsed.header.socket !== null) return false;
    };

    return true;
};

//valida se o nome de sala passado é valido
function validateRoomName(name) {
    name = name.trim();

    if (!name) return false;

    if (name.length > 15) return false;

    if (name.length < 3) return false;

    return true;
};

//verifica se as senhas conhecidem
function validateRoomPass(room, roomPass_byUser) {

    if (room.header.roomPass !== roomPass_byUser) return false;

    return true;
};

//verifica se existe um player com o uuid fornecido dentro da sala
function ValidateAlreadyPlayerInRoom(room, playeruuid) {

    const playerAlreadyInRoom = room.players.find(player => player.header.playeruuid === playeruuid);

    if (playerAlreadyInRoom) {
        if (playerAlreadyInRoom.header.socket !== null) return false;
    };

    return true;
}

//Valida se com os dados passados, é permitida a entrada
function ValidateEntry(nickname, room, roomPass, playeruuid, socketOrExpress) {
    if (socketOrExpress === "express") {
        if (!validateRoomPass(room, roomPass)) return false;

        if (!validateName(nickname , room)) return false;

        return true;

    } else if (socketOrExpress === "socket") {
        if (!validateName(nickname, room)) return false;

        if (!validateRoomPass(room, roomPass)) return false;

        if (!ValidateAlreadyPlayerInRoom(room, playeruuid, nickname)) return false;

        return true;
    };

};

//valida se com os dados passados, pode-se criar uma sala
function validateCreatedRoom(nickname, roomName, maxPlayer, roomPass) {
    //nome do player tem que se enquadrar nos padrões de nome
    if (!validateName(nickname, undefined)) return false;

    //nome da sala tem que se enquadrar nos padrões de nome
    if (!validateRoomName(roomName)) return false;

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