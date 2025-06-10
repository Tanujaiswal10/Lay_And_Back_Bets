const Fancy = require('../model/fancyOddM');
const Match = require('../model/matchM');

class FancyMarketService {
  async createFancyS(data) {
    const {
      matchId,
      team,
      marketName,
      fancyType = 'default',
      odds,
      minBet = 100,
      maxBet = 10000,
      status = 'active'
    } = data;

    if (!matchId || !team || !odds || !marketName) {
      throw new Error('Match ID, team, odds, and market name are required');
    }

    const match = await Match.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    if (!match.teams.includes(team)) {
      throw new Error(`Team '${team}' is not part of the match`);
    }

    if (typeof odds.back !== 'number' || typeof odds.lay !== 'number') {
      throw new Error('Both back and lay odds must be numbers');
    }

    const fancy = new Fancy({
      matchId,
      team,
      marketName,
      fancyType,
      odds: {
        back: odds.back,
        lay: odds.lay
      },
      minBet,
      maxBet,
      status
    });

    await fancy.save();
    return fancy;
  }
}

module.exports = new FancyMarketService();
