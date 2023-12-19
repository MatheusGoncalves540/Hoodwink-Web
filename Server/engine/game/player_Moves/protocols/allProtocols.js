const { startGame } = require('./startGame');
const { takeCoin_basic } = require('./takeCoin_basic');
const { pass_basic } = require('./pass_basic');
const { card_1 } = require('./card_1');
const { card_2 } = require('./card_2');
const { card_3 } = require('./card_3');
const { card_4 } = require('./card_4');
const { pass } = require('./pass');
const { dispute } = require('./dispute');
const { dispute_doesNotHasTheCard } = require('./dispute_doesNotHasTheCard');
const { dispute_hasTheCard } = require('./dispute_hasTheCard');

module.exports = {
    startGame,
    takeCoin_basic,
    pass_basic,
    card_1,
    card_2,
    card_3,
    card_4,
    pass,
    dispute,
    dispute_doesNotHasTheCard,
    dispute_hasTheCard
};