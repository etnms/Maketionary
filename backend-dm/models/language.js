import mongoose from "mongoose";


const Schema = mongoose.Schema;

const Language = new Schema({
    name: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    guestUser: [{type: Schema.Types.ObjectId, ref: "User"}]

})

export default mongoose.model("Language", Language)