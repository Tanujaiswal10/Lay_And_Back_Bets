const User = require("../model/userM");
const Bet = require("../model/betsM");
const Market = require('../model/marketM');
const Match = require('../model/matchM');
const adjustExposureService = require('../service/adjustExposureServiceS');

class betService {

  async placeBetService(userId, matchId, marketId, amount, team, odds, type, status) {
    if (!['back', 'lay'].includes(type)) {
      throw new Error("Invalid Bet type. Use only 'back' or 'lay'");
    }

    const user = await User.findById(userId);
    if (!user) throw new Error("No such user exists");

    if (user.status === 'locked') {
      throw new Error("Your account is locked. Please contact support.");
    }
    if (user.status === 'suspended') {
      throw new Error("Your account is suspended. Please contact support.");
    }

    const match = await Match.findById(matchId);
    if (!match) throw new Error("No such match exists");

    const market = await Market.findById(marketId);
    if (!market) throw new Error("No such market exists");

    if (!team) {
      throw new Error("Please specify the team you're placing a bet on.");
    }

    if (!match.teams.includes(team)) {
      throw new Error(`Team '${team}' is not part of this match`);
    }

    const teamOdds = match.odds.get(team);
    if (!teamOdds) {
      throw new Error(`No odds found for team '${team}'`);
    }

    const actualOdds = teamOdds[type];
    if (actualOdds !== odds) {
      throw new Error(`Odds mismatch! The actual ${type} odds for '${team}' are ${actualOdds}`);
    }

    if (amount < market.minStake) {
      throw new Error(`Minimum stake is ${market.minStake}`);
    }
    if (amount > market.maxStake) {
      throw new Error(`Maximum stake is ${market.maxStake}`);
    }

    const delayInSeconds = market.delay || 0;
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
      placedAt: new Date()
    });

    await bet.save();

    const exposure = await adjustExposureService({
      userId,
      matchId,
      type: 'odds',     
      runnerId: team,
      betType: type,
      stake: amount,
      id: bet._id,
      odds,
      fancyOdds: null, 
    });
    console.log(exposure)

    if (Math.abs(exposure.marketExposure) > user.totalBalance) {
      throw new Error("Insufficient balance for this bet after exposure adjustment.");
    }

    user.exposure = exposure.exposure;
    await user.save();
    return exposure;
  }
}

module.exports = new betService();
