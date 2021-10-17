

window.onload = () => {
  let canvas = new Canvas("canvas", 800, 480);
  let game = new Game(canvas);

  //// Game objects ////
  let objPlane = new ObjectPlane("plane");
  let objTapRight = new Object2D("tap");
  let objLeaderboard = new Object2D("leaderboard");
  let objButton = new Object2D("button");
  let objtextGetReady = new Object2D("textGetReady");
  let collectionScore = new CollectionScore('score');

  objPlane.addImages("planeYellow1.png", "planeYellow2.png", "planeYellow3.png");
  objTapRight.addImage("tapRight.png");
  objLeaderboard.addImage("leaderboards.png");
  objButton.addImage("button.png");
  objtextGetReady.addImage("textGetReady.png");
  for (let i = 0; i <= 9; i++) {
    collectionScore.addImage("number" + i + ".png");
  }

  game.addObject(objPlane);
  game.addObject(objTapRight);
  game.addObject(objLeaderboard);
  game.addObject(objButton);
  game.addObject(objtextGetReady);
  game.addObject(collectionScore);

  //// Layers ////
  let layerBackground = new Background("background.png", 1);
  let layerGroundGrass = new Background("groundGrass.png", 4);
  let layerReady = new LayerReady();
  let layerPlay = new LayerPlay();

  //// Stages ////
  let stageReady = new Stage("getReady");
  let stagePlay = new Stage("play");

  stageReady.addLayer(layerBackground);
  stageReady.addLayer(layerGroundGrass);
  stageReady.addLayer(layerReady);
  stagePlay.addLayer(layerBackground);
  stagePlay.addLayer(layerGroundGrass);
  stagePlay.addLayer(layerPlay);

  game.addStage(stageReady);
  game.addStage(stagePlay);
  game.start();
};
