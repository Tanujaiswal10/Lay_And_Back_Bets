const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const fancyMarketSchema = new Schema({
  matchId: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  team: {
    type: String,
    required: true,
    trim: true
  },
  marketName: {
    type: String,
    required: true
  },
  fancyType: {
    type: String,
    enum: ['default', 'book'],
    default: 'default'
  },
  odds: {
    type: new Schema({
      back: { type: Number, required: true },
      lay: { type: Number, required: true }
    }, { _id: false }),
    required: true
  },
  minBet: {
    type: Number,
    default: 100
  },
  maxBet: {
    type: Number,
    default: 10000
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'settled'],
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

const Fancy = model('Fancy', fancyMarketSchema);

module.exports = Fancy;
