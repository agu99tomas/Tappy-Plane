const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    playerName : String,
    score : Number
})

module.exports = mongoose.model('scores', ScoreSchema);