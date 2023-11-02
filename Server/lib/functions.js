//gera um id
function generateNewId() {
  const Id = Math.floor((Math.random() * Math.random()) * Date.now()).toString(16);
  return Id
};

//gera um uuid4
function uuidv4(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (dt + Math.random()*16)%16 | 0;
    dt = Math.floor(dt/16);
    return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
};

//embaralha um array
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
    array[randomIndex], array[currentIndex]];
  };

  return array;
};

//traz o próximo maior numero de um array, se não houver, traz o menor
function nextBigger(array, givenNumber) {
  let nextBigger = undefined;
  
  for (const number of array) {
    if (number > givenNumber) {
      if (nextBigger === undefined || number < nextBigger) {
        nextBigger = number;
      }
    }
  };

  if (nextBigger === undefined) return Math.min(...array);
  
  return nextBigger;
};

function getPlayerNickFromCurrentMove(currentMove) {
  return currentMove.player.header.nickname
}

module.exports = {generateNewId, uuidv4, shuffle, nextBigger, getPlayerNickFromCurrentMove};