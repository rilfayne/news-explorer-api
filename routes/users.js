const userRouter = require('express').Router();
const { getUser } = require('../controllers/usersController');

userRouter.get('/me', getUser);

module.exports = userRouter;
