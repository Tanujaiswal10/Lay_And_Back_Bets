const User = require("../model/userM");
const Bet = require("../model/betsM");
const Market = require('../model/marketM');
const Match = require('../model/matchM');
const Bookmaker = require('../model/bookmakerM');
const Fancy = require('../model/fancyOddM')
const adjustExposureService = require('../service/adjustExposureServiceS');

class betService {
  async placeBetService(userId, matchId, marketId, betType, bookmakerId, fancyId, amount, team, odds, type, status) {
    if (!['back', 'lay'].includes(type)) {
      throw new Error("Invalid Bet type. Use only 'back' or 'lay'");
    }

    const user = await User.findById(userId);
    if (!user) throw new Error("No such user exists");

    if (user.status === 'locked') throw new Error("Your account is locked. Please contact support.");
    if (user.status === 'suspended') throw new Error("Your account is suspended. Please contact support.");

    const match = await Match.findById(matchId);
    if (!match) throw new Error("No such match exists");

    if (!team) throw new Error("Please specify the team you're placing a bet on.");
    if (!match.teams.includes(team)) throw new Error(`Team '${team}' is not part of this match`);

    let delayInSeconds = 0;
    let actualOdds = null;
    let runnerId = team;

    if (betType === 'odds') {
      const market = await Market.findById(marketId);
      if (!market) throw new Error("No such market exists");

      if (amount < market.minStake) throw new Error(`Minimum stake is ${market.minStake}`);
      if (amount > market.maxStake) throw new Error(`Maximum stake is ${market.maxStake}`);

      const teamOdds = match.odds.get(team);
      if (!teamOdds) throw new Error(`No odds found for team '${team}'`);
      actualOdds = teamOdds[type];
      delayInSeconds = market.delay || 0;

    } else if (betType === 'bookmaker') {
      const bookmaker = await Bookmaker.findById(bookmakerId);
      if (!bookmaker) throw new Error("No such bookmaker exists");

      const oddsEntry = bookmaker.odds.get(team);
      if (!oddsEntry) throw new Error(`No odds found for team '${team}' in bookmaker`);
      actualOdds = oddsEntry[type];
      delayInSeconds = bookmaker.delay || 0;

    } else if (betType === 'fancy') {
      const fancy = await Fancy.findById(fancyId);
      if (!fancy) throw new Error("No such fancy exists");

      actualOdds = fancy.odds;
      delayInSeconds = fancy.delay || 0;
      runnerId = fancy._id; 
    } else {
      throw new Error("Invalid bet type. Must be one of 'odds', 'bookmaker', or 'fancy'");
    }

    if (actualOdds !== odds) {
      throw new Error(`Odds mismatch! The actual ${type} odds for '${team}' are ${actualOdds}`);
    }

    if (delayInSeconds > 0) {
      await new Promise(resolve => setTimeout(resolve, delayInSeconds * 1000));
    }

    const bet = new Bet({
      userId,
      matchId,
      marketId,
      amount,
      team,
      odds,
      type,
      status,
      betType,
      placedAt: new Date()
    });
    await bet.save();

    const exposure = await adjustExposureService({
      userId,
      matchId,
      type: betType,
      runnerId: runnerId,
      betType: type,
      stake: amount,
      id: bet._id,
      odds: betType === 'fancy' ? null : odds,
      fancyOdds: betType === 'fancy' ? odds : null
    });

    console.log('Exposure:', exposure);

    if (Math.abs(exposure.marketExposure) > user.totalBalance) {
      throw new Error("Insufficient balance for this bet after exposure adjustment.");
    }

    user.exposure = exposure.exposure;
    await user.save();

    return exposure;
  }
}



module.exports = new betService();
