const mongoose = require('mongoose');
const { Schema,model } = mongoose;
const Market = require('../model/marketM')

const bookMakerSchema = new Schema({
  matchId: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  teams: {
    type: [String],
    required: true,
    validate: {
      validator: (val) => val.length >= 2,
      message: 'At least two teams are required'
    }
  },
  odds: {
    type: Map,
    of: new Schema({
      back: { type: Number, required: true },
      lay: { type: Number, required: true }
    }, { _id: false }),
    default: {}
},
  minBet: {
    type: Number,
    default: 100
  },
  maxBet: {
    type: Number,
    default: 50000
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


const Bookmaker = model('Bookmaker',bookMakerSchema)

module.exports = Bookmaker