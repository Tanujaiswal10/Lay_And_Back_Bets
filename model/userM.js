const { model, Schema, Types } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  totalBalance: {
    type: Number,
    required: true,
    default: 0,
  },
  exposure: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'locked'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const User = model('User', userSchema);

module.exports = User;
