const { startGame } = require('./startGame');
const { takeCoin_basic } = require('./takeCoin_basic');
const { pass_basic } = require('./pass_basic');
const { card_1 } = require('./card_1');
const { card_2 } = require('./card_2');
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
    pass,
    dispute,
    dispute_doesNotHasTheCard,
    dispute_hasTheCard
};