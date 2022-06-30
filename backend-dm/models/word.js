import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Word = new Schema({
    word: {type: String, required: true},
    translation: {type: String},
    definition: {type: String},
    example: {type: String},
    pos: {type: String},
    gloss: {type: String},
    language: {type: Schema.Types.ObjectId, ref: "Language", required: true},
    user: {type: Schema.Types.ObjectId, required: true},
})

export default mongoose.model("Word", Word)