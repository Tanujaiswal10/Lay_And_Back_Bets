const Transaction = require('../model/transactionM')
const User = require('../model/userM')
const Bet = require('../model/betsM')

class TransactionService {

  async createTransactionService(data) {
    const { userId, type, amount, relatedBet, status } = data;

    if (!userId) throw new Error('User ID is required');
    if (!type) throw new Error('Transaction type is required');
    if (!amount || amount <= 0) throw new Error('Valid amount is required');

    const user = await User.findById(userId);
    if (!user) throw new Error('No such user exists');

    switch (type) {
      case 'deposit':
        if (status !== 'completed') break;
        user.totalBalance += amount;
        await user.save();
        break;

      case 'withdrawal':
        if (status !== 'completed') break;
        if (user.totalBalance < amount) {
          throw new Error('Insufficient balance for withdrawal');
        }
        user.totalBalance -= amount;
        await user.save();
        break;

      case 'bet':
        if (!relatedBet) throw new Error('relatedBet is required for bet transaction');
        const bet = await Bet.findById(relatedBet);
        if (!bet) throw new Error('No such bet exists');
        if (user.totalBalance < amount) throw new Error('Insufficient balance for bet');
        user.totalBalance -= amount;
        user.exposure += amount;
        await user.save();
        break;

      case 'win':
        if (!relatedBet) throw new Error('relatedBet is required for win transaction');
        user.totalBalance += amount;
        await user.save();
        break;

      case 'commission':
        user.totalBalance += amount;
        await user.save();
        break;

      case 'refund':
        if (!relatedBet) throw new Error('relatedBet is required for refund transaction');
        user.totalBalance += amount;
        await user.save();
        break;

      default:
        throw new Error('Invalid transaction type');
    }

    const transaction = new Transaction({
      userId,
      type,
      amount,
      status: status || 'pending',
      relatedBet: relatedBet || null
    });

    await transaction.save();
    return transaction;
  }

  async getTransactionByIdService(id) {
    const transaction = await Transaction.findById(id)
    if(!transaction) throw new Error("no such transaction exist")
    return await Transaction.findById(id).populate('userId relatedBet');
  }

  async getUserTransactionsService(id) {
    return await Transaction.find({userId:id }).sort({ createdAt: -1 });
  }
}

module.exports = new TransactionService();
