const { StartExpress_Pages, Listen_App } = require('./engine/expressApp');
const { Start_WebSocket } = require('./engine/websocket');

//mapa das salas
let rooms = {};

//define o fuso horário para o padrão UTC0
process.env.TZ = 'UTC';

//não parar o processo caso ocorra um erro
process.on('uncaughtException', (error) => {
  console.error('Erro não tratado:', error);
});

//define as páginas no express
StartExpress_Pages(rooms);

//executa inicio a tudo referente aos websockets
Start_WebSocket(rooms);

//depois que tudo foi definido corretamente: execute as páginas express
Listen_App();
