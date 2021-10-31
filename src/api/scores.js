const express = require('express');
const router = express.Router();

const Score = require('../models/score');


router.get('/scores', async (req, res) => {
    const limit = parseInt(req.query.max_results);
    const sort = parseInt(req.query.sort);

    Score.find((err, scores) => {
        err && res.status(500).send(err.message);
        res.status(200).json(scores);
    }).sort( { "score": sort } ).limit(limit > 0 ? limit : 0);
});

router.post('/scores', async (req, res) => {
    req.body.ip =     req.body.ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    const score = new Score(req.body);

    score.save((err, score) => {
        err && res.status(500).send(err.message);
        res.status(200).json(score);
    });
});



module.exports = router;