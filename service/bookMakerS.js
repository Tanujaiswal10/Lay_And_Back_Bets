const Bookmaker = require('../model/bookmakerM');
const Match = require('../model/matchM');

class BookmakerService {
  async crateBookmakerBetS(data) {
    console.log(data);
    console.log("--------------------------------------------------------------");

    const { matchId, teams, odds, minBet, maxBet } = data;
    console.log(matchId, teams, odds, minBet, maxBet);

    if (!matchId || !teams || teams.length !== 2 || !odds) {
      throw new Error('Match ID, two teams, and odds are required');
    }

    const matchExists = await Match.findById(matchId);
    if (!matchExists) {
      throw new Error('Match not found');
    }

    teams.forEach(team => {
      if (!matchExists.teams.includes(team)) {
        throw new Error(`Team "${team}" is not part of this match`);
      }
    });
    teams.forEach(team => {
      const teamOdds = odds[team]; 
      if (!teamOdds) {
        throw new Error(`Odds not provided for team: ${team}`);
      }

      if (
        typeof teamOdds.back !== 'number' ||
        typeof teamOdds.lay !== 'number'
      ) {
        throw new Error(`Invalid odds format for team: ${team}`);
      }
    });

    const newBookmaker = new Bookmaker({
      matchId,
      teams,
      odds,
      minBet,
      maxBet
    });

    await newBookmaker.save();
    return newBookmaker;
  }
}

module.exports = new BookmakerService();
