//src/models/ChatMessage.js
const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
    sessionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSession",
        required: true
    },
    sender:{
        type: String,
        enum: ["user", "bot"],
        required: true
    },
    content:{
        type: String,
        required: true
    },
    mode:{
        type: String,
        enum: ["predict", "chat"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);