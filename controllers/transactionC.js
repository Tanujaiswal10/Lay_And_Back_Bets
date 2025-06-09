const TransactionService = require('../service/transactionS');

class TransactionController {

  async createTransaction(req, res) {
        try 
        {
            const transactionData = req.body;
            const transaction = await TransactionService.createTransactionService(transactionData);
            res.status(201).json(transaction);
        } 
        catch (error) 
        {
             res.status(500).json({ error: error.message });
        }
  }

  async getTransactionById(req, res) {
    try 
    {
        const id = req.params.id;
        const transaction = await TransactionService.getTransactionByIdService(id);
        res.status(200).json(transaction);
    } 
    catch (error) 
    {
       res.status(500).json({ error: error.message });
    }
  }

  async getUserTransactions(req, res) {
    try 
    {
      const id = req.params.id;
      console.log(id)
      const transaction = await TransactionService.getUserTransactionsService(id);
      console.log(transaction)
      res.status(200).json(transaction);
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TransactionController();
