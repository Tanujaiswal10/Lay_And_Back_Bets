const { model, Schema, Types } = require('mongoose');

const transactionSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'bet', 'win', 'commission', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  relatedBet: {
    type: Types.ObjectId,
    ref: 'Bet',
    default: null
  }
}, { timestamps: true });

const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;
