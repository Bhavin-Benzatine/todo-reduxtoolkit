const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    todo : {
        type : String,
        required : true
    },
    todoBy : {
        type: mongoose.Types.ObjectId,
        ref : "User"
    }
});

module.exports = mongoose.model('Todo', todoSchema);    