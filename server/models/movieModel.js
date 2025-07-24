import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({});

const movieModel = mongoose.model("Movie", movieSchema);

export default movieModel;
