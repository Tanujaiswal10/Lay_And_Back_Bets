const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketC')

router.post('/create', marketController.createMarkerController);
router.patch('/update/:id', marketController.updateMarket);
router.get('/getall', marketController.getAllMarkets);
router.get('/:id', marketController.getMarketById);
router.delete('/delete/:id', marketController.deleteMarket);


module.exports = router;
