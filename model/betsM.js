const {model,Schema} = require('mongoose')
const mongoose = require('mongoose')
const User = require('./userM')

const betSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    matchId: {
        type: Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    marketId: {
        type: Schema.Types.ObjectId,
        ref: 'Market',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    team:{
        type:String,
        required:true
    },
    odds: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['back', 'lay'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'won', 'lost', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

const Bet = model('Bet', betSchema);

module.exports = Bet;
