// routes/comment.js
var express = require('express');
var api = express.Router();
var CommentController = require('../controllers/Comment');
var md_auth = require('../middlewares/authenticated');

api.post('/add-comment/:publicationId', md_auth.ensureAuth, CommentController.addComment);

api.get('/comments/:publicationId', CommentController.getComments);

module.exports = api;
