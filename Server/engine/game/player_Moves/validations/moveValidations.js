//TODO a ideia é ter um array que vai conter as jogadas possíveis com base no momento atual do jogo.
//sempre que alguém fizer alguma ação, uma função que vai atualizar o array com as possíveis jogadas, vai rodar
//essa função, vai chamar diversas outras funções, que individualmente vão fazer verificações e checar se a jogada referente à aquela função é valida ou não.
//se for valida, a função daquela jogada vai retornar true, e aquela jogada, será adicionada no array de jogadas possíveis.
//sempre que alguma ação de um player chegar no servidor, ela será validada como uma ação possível ou não, pelo array.
//caso o player enviou uma jogada que não é possível ser feita, ele será expulso da sala por trapaça
//Pois serão feitas validações no lado do cliente para que apenas as jogadas válidas sejam enviadas ao servidor.
//então, caso elas tenham sido enviadas mesmo assim, o jogador adulterou os arquivos do cliente, e enviou uma jogada invalida à força.

function updatePossibleMovesArray(possiblesMoves) {
    
};

module.exports = { updatePossibleMovesArray }