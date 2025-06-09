const express = require('express')
const route = express.Router();

const betController = require('../controllers/betC')

route.post("/placebet",betController.placebetController)

module.exports = route