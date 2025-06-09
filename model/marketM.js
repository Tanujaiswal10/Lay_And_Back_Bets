const { model, Schema, Types } = require('mongoose');

const marketSchema = new Schema({
  eventType: {
    type: String,
    required: true, 
    enum: ['Football', 'Horse Racing', 'Cricket', 'Tennis', 'Casino', 'Other']
  },
  startTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'suspended', 'settled'],
    default: 'open'
  },
  delay: Number,
  minStake: {
      type: Number,
      default: 10
    },
  maxStake: {
      type: Number,
      default: 10000
    },
  createdBy: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, { timestamps: true });

const Market = model('Market', marketSchema);

module.exports = Market;
