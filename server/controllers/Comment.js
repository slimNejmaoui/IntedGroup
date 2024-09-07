// controllers/comment.js
const Comment = require('../models/comment');
const Publication = require('../models/publication');
const User = require('../models/user');

async function addComment(req, res) {
    try {
        const publicationId = req.params.publicationId;
        const { text } = req.body;
        const userId = req.user.sub;

        const publication = await Publication.findById(publicationId);
        if (!publication) return res.status(404).send({ message: 'Publication not found' });

        const newComment = new Comment({
            publication: publicationId,
            user: userId,
            text
        });

        const commentStored = await newComment.save();
        res.status(200).send({ comment: commentStored });
    } catch (err) {
        res.status(500).send({ message: 'Error saving comment' });
    }
}

async function getComments(req, res) {
    try {
        const publicationId = req.params.publicationId;

        const comments = await Comment.find({ publication: publicationId }).populate('user', 'name surname');
        res.status(200).send({ comments });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching comments' });
    }
}

module.exports = {
    addComment,
    getComments
};
