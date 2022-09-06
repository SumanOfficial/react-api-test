const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoteSchema = new Schema({
    // user is a forgein key for user id, for user should get notly those notes white were post by them
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("note", NoteSchema);
