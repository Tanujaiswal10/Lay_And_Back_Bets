const User = require('../model/userM');
const UserMatchExposure = require('../model/userMatchExposureM');
const express = require('express');
const router = express.Router();

router.post("/winner", async (req, res) => {
  try {
    const { matchId, winnerTeam, status, betType } = req.body;

    if (!matchId || (!winnerTeam && !['draw', 'suspended'].includes(status))) {
      return res.status(400).json({ error: 'Provide matchId and either winnerTeam or a status like draw/suspended' });
    }

  
    const exposures = await UserMatchExposure.find({ matchId, type: betType });

    for (const exposure of exposures) {
      const { userId, bets } = exposure;
      let balanceUpdate = 0;

      for (const bet of bets) {
        if (bet.status !== 1) continue; 

        if (status === 'draw' || status === 'suspended') {
          bet.status = 0;
          continue;
        }

        const isWin = bet.runnerId.toString() === winnerTeam.toString();

        if (bet.betType === 'back') {
          balanceUpdate += isWin ? bet.potentialProfit : -bet.stake;
        } else if (bet.betType === 'lay') {
          balanceUpdate += !isWin ? bet.stake : -bet.liability;
        }

        bet.status = 0;
      }

      
      exposure.settled = true;
      exposure.marketExposure = 0;
      exposure.netExposure = {};
      await exposure.save();

      const allExposures = await UserMatchExposure.find({ userId, matchId });
      let newTotalExposure = 0;
      allExposures.forEach(exp => {
        if (exp.marketExposure) {
          newTotalExposure += Math.abs(exp.marketExposure);
        }
      });

      await User.findByIdAndUpdate(
        userId,
        {
          $inc: { totalBalance: balanceUpdate },
          $set: { exposure: newTotalExposure }
        }
      );
    }

    return res.status(200).json({ message: `${betType} bets settled successfully` });

  } catch (error) {
    console.error("Settlement error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
