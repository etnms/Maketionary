import mongoose from "mongoose";


const Schema = mongoose.Schema;

const Language = new Schema({
    name: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, required: true},
})

export default mongoose.model("Language", Language)