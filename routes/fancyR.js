const express = require('express');
const fancyController = require('../controllers/fancyC');

const router = express.Router();

router.post('/create', fancyController.createFancyC);

module.exports = router;
