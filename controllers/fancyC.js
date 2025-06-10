const fancyMarketSchema = require('../service/fancyS')

class fancyController
{
    async createFancyC(req,res)
    {
        try
        {
            const fancy = await fancyMarketSchema.createFancyS(req.body)
            res.status(201).json({
                    success: true,
                    message: 'Fancy created successfully',
                    data: fancy
                    });
        }
        catch(error)
        {
                res.status(400).json({
                success: false,
                message: error.message || 'Failed to create Fancy odds'
                });
        }
    }
}

module.exports = new fancyController()