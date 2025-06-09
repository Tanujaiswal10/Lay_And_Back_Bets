const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const betSubSchema = new Schema({
  runnerId: { type: String, required: true },  
  betType: { type: String, enum: ['back', 'lay'], required: true },
  stake: { type: Number, required: true },
  odds: { type: Number, required: true },
  potentialProfit: { type: Number, required: true },
  liability: { type: Number, required: true },
  status: { type: Number, default: 1 },  
}, { _id: false });

const exposureSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  type: { type: String, required: true }, 
  bets: [betSubSchema],
  netExposure: { type: Map, of: Number, default: {} },
  marketExposure: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = model('UserMatchExposure', exposureSchema);
