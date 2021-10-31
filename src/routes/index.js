const express = require('express');
const router = express.Router();

const Score = require('../models/score');

router.get('/', async (req, res) =>{
    res.render('index');
});

router.get('/admin', async (req, res) =>{
    const scores = await Score.find().sort({ "score": -1 });
    res.render('admin', {
        scores
    });
});


router.post('/scores/add', async (req, res) =>{
    const score = new Score(req.body);
    await score.save();
    res.redirect('/admin');
});

router.get('/scores/delete/:id', async (req, res) =>{
    const { id } = req.params;
    await Score.remove({_id : id});
    res.redirect('/admin');
});

router.get('/scores/edit/:id', async (req, res) =>{
    const { id } = req.params;
    const score = await Score.findById(id);
    res.render('edit', {
        score
    });
});

router.post('/scores/edit/:id', async (req, res) =>{
    const { id } = req.params;
    await Score.updateOne({_id : id }, req.body);
    res.redirect('/admin');
});


module.exports = router;