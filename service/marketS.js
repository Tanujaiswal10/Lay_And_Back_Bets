const Market = require('../model/marketM');
const User = require('../model/userM')


class marketService
{
    async  createMarketService(eventType,startTime,status,delay, minStake, maxStake,createdBy) {
        const user = await User.findById(createdBy)
        if(!user) throw new Error("no such user exists") 

        const market = new Market({
            eventType,
            startTime,
            status,
            delay,
            minStake,
            maxStake,
            createdBy
        });

        await market.save();
        return ('Market created:', market);
    }

    async updateMarketService(marketID,updateMarketData)
    {
        const market = await Market.findById(marketID)
        if(!market) throw new Error("no such marketID exists") 

        return await Market.findByIdAndUpdate(marketID,updateMarketData, { new: true });
    }

    async getMarketByIdService(marketID) 
    {
        const market = await Market.findById(marketID)
        if(!market) throw new Error("no such marketID exists") 

        return await Market.findById(marketID);
    }

    async deleteMarketService(marketID)
    {
        const market = await Market.findById(marketID)
        if(!market) throw new Error("no such marketID exists") 

         await Market.findByIdAndUpdate(marketID);
         return "deleted"
    }

    async getAllMarketService()
    {
       const market = await Market.find().sort({ startTime: 1 })
       return market
    }
}

module.exports = new marketService