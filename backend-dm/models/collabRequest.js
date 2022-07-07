import mongoose from "mongoose";

const Schema = mongoose.Schema;

const collabRequest = new Schema({
    project: {type: Schema.Types.ObjectId, ref: "Language", required: true},
    sender: {type: String},
    requestedUser: {type: Schema.Types.ObjectId, ref: "User",  required: true}
})

export default mongoose.model("collabRequest", collabRequest)