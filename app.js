require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const usersRouter = require('./routes/users.js');
const articlesRouter = require('./routes/articles.js');
const { login, createUser } = require('./controllers/usersController');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errors');
const NotFoundError = require('./errors/not-found-err');
const { validateUser, validateNewUser } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/news-explorerdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);

app.post('/signin', validateUser, login);

app.post('/signup', validateNewUser, createUser);

app.use(auth);

// сопоcтавляем роутер с конечной точкой "/users"
app.use('/users', usersRouter);

// сопоcтавляем роутер с конечной точкой "/articles"
app.use('/articles', articlesRouter);

// выводим сообщение с ошибкой, если человек попытался перейти по несуществующей ссылке
app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(PORT);
