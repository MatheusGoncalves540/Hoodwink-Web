const { StartExpress_Pages, Listen_App } = require('./engine/expressApp');
const { Start_WebSocket } = require('./engine/websocket');

//mapa das salas
let rooms = {};

//define o fuso horário para o padrão UTC0
process.env.TZ = 'UTC';

//setar as páginas no express
try {
  StartExpress_Pages(rooms);
} catch (error) {
  console.log(error);
}

//da inicio a tudo referente aos websockets
try {
  Start_WebSocket(rooms);
} catch (error) {
  console.log(error);
}

//depois que tudo foi definido corretamente: Inicie as páginas express
try {
  Listen_App();
} catch (error) {
  console.log(error);
}
