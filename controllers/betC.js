const betService = require('../service/betS');

class betController
{
    async placebetController(req,res)
    {
        try
        {
            const result = await betService.placeBetService(req.body);
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