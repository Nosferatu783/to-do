const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Todo', todoSchema);
