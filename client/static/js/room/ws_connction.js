function getPlayeruuid () {
    let playeruuid = localStorage.getItem("playeruuid");
    if (!playeruuid) {
        playeruuid = uuidPlayer; // playeruuid fornecido pelo servidor, que foi recebido no head do html.
        localStorage.setItem("playeruuid", playeruuid);
    };
    return playeruuid;
};

const idRoom = (window.location.href).split('/room/')[1];
const playeruuid = getPlayeruuid();

//cria conexão websocket
const ws = new WebSocket(`ws://localhost:8080/?idRoom=${idRoom}&playeruuid=${playeruuid}&nickname=${nickname}&roomPass=${roomPass}`);