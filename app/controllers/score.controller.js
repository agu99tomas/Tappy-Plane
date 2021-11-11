const Score = require("../models/score.model.js");


// Create
exports.create = (req, res) => {

  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const score = new Score({
    playerName: req.body.playerName,
    score: req.body.score,
  });

  Score.create(score, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Score."
      });
    else res.send(data);
  });
};

// Retrieve all Scores
exports.findAll = (req, res) => {
  Score.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tutorials."
      });
    else res.send(data);
  });
};

// Find a single Score
exports.findOne = (req, res) => {
  Score.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Score with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Score with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Update a Score 
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Score.updateById(
    req.params.id,
    new Score(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Score with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Score with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Score
exports.delete = (req, res) => {
  Score.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Score with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Score with id " + req.params.id
        });
      }
    } else res.send({ message: `Score was deleted successfully!` });
  });
};

