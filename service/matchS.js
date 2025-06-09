const Match = require('../model/matchM');

class MatchService {

  async createMatch(data) {
    const { marketId, name, teams, odds, status } = data;

    if (!marketId || !name || !Array.isArray(teams) || teams.length < 2) {
      throw new Error('Missing or invalid match data');
    }

    const match = new Match({
      marketId,
      name,
      teams,
      odds,
      status
    });

    await match.save();
    return match;
  }


  async getMatchById(id) 
  {
    const match = await Match.findById(id);
    if (!match) 
        {
            throw new Error('Match not found');
        }
    return match;
  }


  async getAllMatches(filters = {}) 
  {
    const query = {};

    if (filters.marketId) query.marketId = filters.marketId;
    if (filters.status) query.status = filters.status;

    const matches = await Match.find(query).sort({ date: 1 });
    return matches;
  }

 
  async getAllByMarketId(marketId) 
  {
    if (!marketId) 
        {
          throw new Error('Market ID is required');
        }

    const matches = await Match.find({ marketId }).sort({ date: 1 });
    return matches;
  }


  async updateMatch(id, updateData)
  {
    const match = await Match.findByIdAndUpdate(id, updateData, {new: true});

    if (!match) 
        {
              throw new Error('Match not found or update failed');
        }

    return match;
  }

  async deleteMatch(id) 
  {
    const match = await Match.findByIdAndDelete(id);

    if (!match) 
        {
            throw new Error('Match not found or already deleted');
        }

    return { message: 'Match deleted successfully' };
  }
}

module.exports = new MatchService();
