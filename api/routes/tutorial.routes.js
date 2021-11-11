module.exports = app => {
  const scores = require("../controllers/score.controller.js");

  var router = require("express").Router();

  router.post("/", scores.create);

  router.get("/", scores.findAll);

  router.get("/:id", scores.findOne);

  router.put("/:id", scores.update);

  router.delete("/:id", scores.delete);

  app.use('/api/scores', router);
};
