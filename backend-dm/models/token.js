import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Token = new Schema({
  token: { type: String },
});

export default mongoose.model("Token", Token);
