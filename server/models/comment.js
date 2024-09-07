// models/comment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    publication: { type: Schema.Types.ObjectId, ref: 'Publication', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
