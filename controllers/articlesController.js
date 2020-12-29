const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user._id });
    res.status(200).send(articles);
  } catch (err) {
    next(err);
  }
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

const deleteArticle = async (req, res, next) => {
  const userId = req.user._id; // id пользователя, который пытается удалить статью
  try {
    const article = await Article.findById({ _id: req.params.id })
      .orFail(new NotFoundError('Нет статьи с таким id'))
      .populate('owner');
    if (article.owner._id.toString() !== userId) {
      return next(new ForbiddenError('Вы можете удалять только свои статьи'));
    }
    return Article.findByIdAndDelete({ _id: req.params.id })
      .then(() => res.status(200).send(article))
      .catch(next);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
