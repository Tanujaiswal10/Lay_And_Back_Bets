const betService = require('../service/betS');

class betController
{
    async placebetController(req,res)
    {
        try
        {
            const { userId,matchId, marketId, amount, team, odds, type, status } = req.body;
            const result = await betService.placeBetService(userId, matchId,marketId, amount,team, odds, type, status);
            res.status(200).json({
            message: result
            });        

        }
        catch(err)
        {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = new betController