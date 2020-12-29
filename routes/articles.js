const articlesRouter = require('express').Router();
const { getArticles, createArticle, deleteArticle } = require('../controllers/articlesController');
const { validateId, validateArticle } = require('../middlewares/validation');

articlesRouter.get('/', getArticles);

articlesRouter.post('/', validateArticle, createArticle);

articlesRouter.delete('/:id', validateId, deleteArticle);

module.exports = articlesRouter;
