const User = require('../model/userM');
const UserMatchExposure = require('../model/userMatchExposureM');
const express = require('express');
const router = express.Router();


router.post("/winner", async (req, res) => {
  try {
    const { matchId, winnerTeam, status } = req.body;

    if (!matchId || (!winnerTeam && !['draw', 'suspended'].includes(status))) {
      return res.status(400).json({ error: 'Provide matchId and either winnerTeam or status (draw/suspended)' });
    }

    const exposures = await UserMatchExposure.find({ matchId });

    for (const exposure of exposures) {
      const { userId, bets } = exposure;
      let balanceUpdate = 0;

      for (const bet of bets) {
        const isWin = bet.runnerId === winnerTeam;

        if (status === 'draw' || status === 'suspended') {
          bet.status = 0;
          continue;
        }

        if (bet.betType === 'back') {
          if (isWin) {
            balanceUpdate += bet.potentialProfit;
          } else {
            balanceUpdate -= bet.stake;
          }
        } else if (bet.betType === 'lay') {
          if (!isWin) {
            balanceUpdate += bet.stake;
          } else {
            balanceUpdate -= bet.liability;
          }
        }

        bet.status = 0; 
      }

      await User.findByIdAndUpdate(
        userId,
        {
          $inc: { totalBalance: balanceUpdate },
          $set: { exposure: 0 }
        }
      );

      exposure.settled = true;
      await exposure.save();
    }

    return res.status(200).json({ message: "Match settled successfully" });

  } catch (error) {
    console.error("Settlement error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router