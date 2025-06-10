const bookmakerService = require('../service/bookMakerS')


class bookmakerController
{
    async crateBookmakerBetC(req,res)
    {
        try
        {
                const { matchId, teams, odds, minBet, maxBet} = req.body
                const bookmaker = await bookmakerService.crateBookmakerBetS(matchId, teams, odds, minBet, maxBet);

                    res.status(201).json({
                    success: true,
                    message: 'Bookmaker odds created successfully',
                    data: bookmaker
                    });
        }
        catch(err)
        {
             res.status(400).json({
                success: false,
                message: err.message || 'Failed to create bookmaker odds'
                });
        }
    }
}


module.exports = new bookmakerController()