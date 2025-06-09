const mongoose = require('mongoose');
const { Schema,model } = mongoose;
const Market = require('../model/marketM')

const matchSchema = new Schema({
  marketId: {
    type: Schema.Types.ObjectId,
    ref: 'Market',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
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
  status: {
    type: String,
    enum: ['scheduled', 'live', 'finished', 'canceled'],
    default: 'scheduled'
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


const Match = model('Match',matchSchema)

module.exports = Match