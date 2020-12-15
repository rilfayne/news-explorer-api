const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = async (req, res, next) => {
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
  } catch (err) {
    next(err);
  }
  try {
    const {
      name, email,
    } = req.body;
    await User.create({
      name, email, password: hashedPassword,
    });
    return res.status(200).send({ message: 'Поздравляем! Вы успешно зарегистрировались!' });
  } catch (err) {
    let error;
    if (err.name === 'MongoError' && err.code === 11000) {
      error = new ConflictError('Пользователь с таким email уже есть');
      return next(error);
    }
    return next(err);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const getUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId)
      .orFail(new NotFoundError('Пользователь с таким id не найден'));
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  login,
  getUser,
};
