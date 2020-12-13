const router = require('express').Router();

const usersRouter = require('./users');
const articlesRouter = require('./articles');
const { login, createUser } = require('../controllers/usersController');
const auth = require('../middlewares/auth');
const { validateUser, validateNewUser } = require('../middlewares/validation');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', validateUser, login);
router.post('/signup', validateNewUser, createUser);
router.use(auth);

// сопоcтавляем роутер с конечной точкой "/users"
router.use('/users', usersRouter);
// сопоcтавляем роутер с конечной точкой "/articles"
router.use('/articles', articlesRouter);

// выводим сообщение с ошибкой, если человек попытался перейти по несуществующей ссылке
router.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
