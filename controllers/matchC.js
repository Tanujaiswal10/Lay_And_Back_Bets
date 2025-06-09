const matchService = require('../service/matchS');

class MatchController 
{
  async createMatch(req, res) 
  {
    try 
    {
        const match = await matchService.createMatch(req.body);
        res.status(201).json({ success: true, data: match });
    } 
    catch (err) 
    {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getMatchById(req, res) 
  {
    try 
    {
      const id = req.params.id;
      const match = await matchService.getMatchById(id);
      res.status(200).json({ success: true, data: match });
    } 
    catch (err) 
    {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getAllMatches(req, res) 
  {
    try 
    {
      const filters = req.query;
      const matches = await matchService.getAllMatches(filters);
      res.status(200).json({ success: true, data: matches });
    } 
    catch (err) 
    {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getAllByMarketId(req, res) 
  {
    try 
    {
      const { marketId } = req.params;
      const matches = await matchService.getAllByMarketId(marketId);
      res.status(200).json({ success: true, data: matches });
    }
    catch (err) 
    {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async updateMatch(req, res) 
  {
    try 
    {
      const id = req.params.id;
      const updatedMatch = await matchService.updateMatch(id, req.body);
      res.status(200).json({ success: true, data: updatedMatch });
    } 
    catch (err) 
    {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async deleteMatch(req, res) 
  {
    try 
    {
      const id = req.params.id;
      const result = await matchService.deleteMatch(id);
      res.status(200).json({ success: true, ...result });
    } 
    catch (err) 
    {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new MatchController();
