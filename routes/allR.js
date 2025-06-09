const express = require('express')
const router = express.Router();

const Market = require('../model/marketM')
const User = require('../model/userM')
const Bet = require('../model/betsM')
const Match = require('../model/matchM')

//active games api 
router.get("/activeGames",async(req,res)=>{
    try 
    {
        const activeGames = await Match.find({ status: 'live' }).sort({ startTime: 1 });
        res.status(200).json({ success: true, data: activeGames });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }

})
// async function activeGame(req, res) {
//     try 
//     {
//         const activeGames = await Market.find({ status: 'active' }).sort({ startTime: 1 });
//         res.status(200).json({ success: true, data: activeGames });
//     } 
//     catch (error) 
//     {
//         res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// }

//getting all games


router.get("/allgames",async(req,res)=>{
    try 
    {
        const allGame = await Match.find().sort({ startTime: 1 });
        res.status(200).json({ success: true, data: allGame });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }   
})
// async function allGames(req, res) {
//     try 
//     {
//         const allGame = await Market.find().sort({ startTime: 1 });
//         res.status(200).json({ success: true, data: allGame });
//     } 
//     catch (error) 
//     {
//         res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// }

//bet history 

router.get("/bethistory/:id",async(req,res)=>{
    try 
    {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) throw new Error("No such user exists");

        const history = await Bet.find({ userId: id })

        return res.status(200).json({ success: true, data: history });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
})
// async function betHistory(req, res) 
// {
//     try 
//     {
//         const { userId } = req.params;
//         const user = await User.findById(userId);
//         if (!user) throw new Error("No such user exists");


//         const history = await Bet.find({ userId });

//         return res.status(200).json({ success: true, data: history });
//     } 
//     catch (error) 
//     {
//         res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// }

router.get("/getAllLiveMatches",async(req,res)=>{
    try 
    {
        const liveMatches = await Match.find({ status: 'live' }).sort({ startTime: 1 });

        return res.status(200).json({ success: true, data: liveMatches });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }   
})

// async function getAllLiveMatches(req,res)
// {
//     try 
//     {
//         const liveMatches = await Market.find({ status: 'active' }).sort({ startTime: 1 });

//         return res.status(200).json({ success: true, data: liveMatches });
//     } 
//     catch (error) 
//     {
//         res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// }


module.exports = router