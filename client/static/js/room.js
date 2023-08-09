//valor do uuidPlayer sempre fornecido pelo servidor
//console.log(uuidPlayer);

const getPlayeruuid = () => {
    let playeruuid = localStorage.getItem("playeruuid");
    if (!playeruuid) {
        playeruuid = uuidPlayer; // Implemente a geração do playeruuid aqui.
        localStorage.setItem("playeruuid", playeruuid);
    };
    return playeruuid;
};

const idRoom = (window.location.href).split('/room/')[1];
const playeruuid = getPlayeruuid();


//valor do playeruuid final, se já estiver no localStorage, é o mesmo, caso contrario, usa o fornecido pelo servidor
//console.log(playeruuid);

//cria conexão websocket
const ws = new WebSocket(`ws://localhost:8080/?idRoom=${idRoom}&playeruuid=${playeruuid}&nickname=${nickname}&roomPass=${roomPass}`);

//recebe msg do websocket
ws.onmessage = function(msg) {
    document.querySelector('#chat').innerHTML += `<p>${msg.data}</p>`;
    console.log(msg.data)
  };