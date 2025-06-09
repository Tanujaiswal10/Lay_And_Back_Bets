const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchC');

router.post('/create',matchController.createMatch);
router.get('/getAllMatches',matchController.getAllMatches);
router.get('/:id', matchController.getMatchById);
router.get('/market/:marketId',matchController.getAllByMarketId);
router.patch('/:id', matchController.updateMatch);
router.delete('/:id', matchController.deleteMatch);

module.exports = router;
