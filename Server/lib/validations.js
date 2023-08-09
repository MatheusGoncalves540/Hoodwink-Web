function validateName(nickname) {
    if (!nickname) {
        return false;
    }
    if (nickname.length > 20) {
        return false;
    };
    if (nickname.length < 3) {
        return false;
    };
    return true;
};

//verifica se as senhas conhecidem
function validateRoomPass(room, roomPass_byUser) {
    if (room.header.roomPass !== roomPass_byUser) {
        return false;
    };
    return true;
};

//
function ValidateAlreadyPlayerInRoom(room, playeruuid) {
    //verifica se existe um player com o uuid fornecido dentro da sala
    const playerAlreadyInRoom = room.players.find(player => player.uuidPlayer === playeruuid);

    if (!playerAlreadyInRoom) {
        return true;
    };
    if (playerAlreadyInRoom.socket !== null) {
        return false;
    };
    return true;
}

//
function ValidateEntry(nickname, room, roomPass, playeruuid, socketOrExpress) {
    if (socketOrExpress === "express") {
        if (!validateName(nickname)) return false;

        if (!validateRoomPass(room, roomPass)) return false;

        return true;

    } else if (socketOrExpress === "socket") {
        if (!validateName(nickname)) return false;

        if (!validateRoomPass(room, roomPass)) return false;

        if (!ValidateAlreadyPlayerInRoom(room, playeruuid)) return false;

        return true;
    };

};

function validateCreatedRoom(nickname, roomName, maxPlayer, roomPass) {
    //nome do player tem que se enquadrar nos padrões de nome
    if (!validateName(nickname)) return false;

    //nome da sala tem que se enquadrar nos padrões de nome
    if (!validateName(roomName)) return false;

    //não pode ter mais que 10 players
    if (maxPlayer > 10) return false;

    //senha da sala não pode ter mais que 30 caracteres
    if (roomPass.length > 30) return false;

    return true;
};

module.exports = {ValidateEntry, validateCreatedRoom};