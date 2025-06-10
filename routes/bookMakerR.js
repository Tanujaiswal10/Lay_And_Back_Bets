const express = require('express');
const bookmakerController = require('../controllers/bookMakerC');

const router = express.Router();

router.post('/create', bookmakerController.crateBookmakerBetC);

module.exports = router;
