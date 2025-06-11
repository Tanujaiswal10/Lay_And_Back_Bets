const UserMatchExposure = require('../model/userMatchExposureM');
const User = require('../model/userM');
const Match = require('../model/matchM');

const adjustExposureService = async (betDetails) => {

  const { userId, matchId, type, runnerId, betType, stake, id, odds, fancyOdds = null } = betDetails;

  const potentialProfit = betType === 'back' ? parseFloat(((odds - 1) * stake).toFixed(2)) : parseFloat((stake).toFixed(2));
  const liability = betType === 'back' ? parseFloat((stake).toFixed(2)) : parseFloat(((odds - 1) * stake).toFixed(2));

  let exposure = await UserMatchExposure.findOne({ userId, matchId, type });
  const prevMarketExposure = exposure ? exposure.marketExposure : 0;

  const match = await Match.findById(matchId).lean();
  if (!match || !match.teams || match.teams.length < 2) {
    throw new Error("Match or teams data not found.");
  }

  if (!exposure) {
    exposure = new UserMatchExposure({
      userId,
      matchId,
      type,
      bets: [],
      netExposure: {},
      marketExposure: 0,
    });
  }

  exposure.bets.push({
    runnerId,
    betType,
    stake,
    odds,
    potentialProfit,
    liability,
    status: 1,
    fancyOdds,
    id,
  });

  const netExposure = {};

for (const bet of exposure.bets) {
  if (bet.status === 1) {
    const team1 = bet.runnerId;
    const team2 = match.teams.find(team => team !== team1);

    if (!netExposure[team1]) netExposure[team1] = 0;
    if (!netExposure[team2]) netExposure[team2] = 0;

    if (bet.betType === 'back') {
      netExposure[team1] += bet.potentialProfit;
      netExposure[team2] -= bet.liability;
    } else {
      netExposure[team1] -= bet.liability;
      netExposure[team2] += bet.potentialProfit;
    }
  }
}


  Object.keys(netExposure).forEach(team => {
    netExposure[team] = parseFloat(netExposure[team].toFixed(2));
  });

  exposure.netExposure = netExposure;

  const minNetExposure = Math.min(...Object.values(netExposure));
  exposure.marketExposure = minNetExposure < 0 ? parseFloat(Math.abs(minNetExposure).toFixed(2)) : 0;

  await exposure.save();

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $inc: { exposure: -Math.abs(prevMarketExposure) + Math.abs(exposure.marketExposure) }
    },
    { new: true }
  );

  return {
    exposure: updatedUser.exposure,
    netExposure: exposure.netExposure,
    marketExposure: exposure.marketExposure
  };
};

module.exports = adjustExposureService;
