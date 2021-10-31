const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    ip : String,
    playerName : String,
    score : Number
})

module.exports = mongoose.model('scores', ScoreSchema);