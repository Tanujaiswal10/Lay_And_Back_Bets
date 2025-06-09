const marketService = require('../service/marketS')

class marketController
{
    async createMarkerController(req,res)
    {
        const {eventType,startTime,status,delay, minStake, maxStake,createdBy} = req.body;
        
        if(!eventType || !startTime || !status || !createdBy)
            return res.send(400).json({Error:"Please fill all the fields"})

        try
        {
            const market = await marketService.createMarketService(eventType,startTime,status,delay, minStake, maxStake,createdBy)
            res.status(201).json({ message: 'Market created', market });
        }
        catch (error) 
        {
            res.status(500).json({ error: error.message });
        }
    }

    async updateMarket(req, res) {
        try 
        {
            const marketID = req.params.id;
            const updateData = req.body;
            const updatedMarket = await marketService.updateMarketService(marketID, updateData);
            res.status(200).json({ message: 'Market updated', market: updatedMarket });
        } 
        catch (error) 
        {
            res.status(500).json({ error: error.message });
        }
  }

  async getMarketById(req, res) {
        try 
        {
                const marketID = req.params.id;
                const market = await marketService.getMarketByIdService(marketID);
                res.status(200).json(market);
        }
        catch (error) 
        {
        res.status(500).json({ error: error.message });
        }
  }

  async deleteMarket(req, res) {
            try 
            {
                const marketID = req.params.id;
                await marketService.deleteMarketService(marketID);
                res.status(200).json({ message: 'Market deleted' });
            } 
            catch (error) 
            {
            res.status(500).json({ error: error.message });
            }
  }

  async getAllMarkets(req, res) {
        try 
        {
            const markets = await marketService.getAllMarketService();
            res.status(200).json(markets);
        } 
        catch (error) 
        {
        res.status(500).json({ error: error.message });
        }
  }

}

module.exports = new marketController