const express = require('express')
const route = express.Router();

const UserController = require('../controllers/userC')

route.post("/signup",UserController.createUser);
route.get("/:id",UserController.getUserById)
route.patch("/:id",UserController.updateUser)

module.exports = route