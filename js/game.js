window.onload = () => {
  let canvas = new Canvas("canvas", 800, 480);
  let game = new Game(canvas);

  //// Game objects ////
  let objPlane = new ObjectPlane("plane");
  objPlane.addImages(
    "planeYellow1.png",
    "planeYellow2.png",
    "planeYellow3.png"
  );
  game.addObject(objPlane);

  let objTapRight = new Object2D("tap");
  objTapRight.addImage("tapRight.png");
  game.addObject(objTapRight);

  let objCup = new Object2D("cup");
  objCup.addImage("cup.png");
  game.addObject(objCup);

  let objtextGetReady = new Object2D("textGetReady");
  objtextGetReady.addImage("textGetReady.png");
  game.addObject(objtextGetReady);

  let collectionScore = new CollectionScore("score");
  for (let i = 0; i <= 9; i++) {
    collectionScore.addImage("number" + i + ".png");
  }
  game.addObject(collectionScore);

  let writer = new Writer("writer");
  writer.loadImages();
  game.addObject(writer);

  let rocks = new ObjectRock("rock");
  rocks.addImage("rockGrass.png");
  game.addObject(rocks);

  let rocksDown = new ObjectRock("rockDown");
  rocksDown.addImage("rockGrassDown.png");
  game.addObject(rocksDown);

  let textGameOver = new Object2D('textGameOver')
  textGameOver.addImage("textGameOver.png");
  game.addObject(textGameOver);

  //// Layers ////
  let layerBackground = new Background("background.png", 1);
  let layerGroundGrass = new Background("groundGrass.png", 4);
  let layerReady = new LayerReady();
  let layerPlay = new LayerPlay();
  let layerMenu = new LayerMenu();
  let layerAskName = new LayerAskName();
  let layerLeaderboard = new LayerLeaderboard();
  let layerGameOver = new LayerGameOver();

  //// Stages ////
  let stageReady = new Stage("getReady");
  stageReady.addLayer(layerBackground);
  stageReady.addLayer(layerGroundGrass);
  stageReady.addLayer(layerReady);
  stageReady.addLayer(layerMenu);

  let stagePlay = new Stage("play");
  stagePlay.addLayer(layerBackground);
  stagePlay.addLayer(layerPlay);
  stagePlay.addLayer(layerGroundGrass);

  let stageAskName = new Stage("askName");
  stageAskName.addLayer(layerBackground);
  stageAskName.addLayer(layerGroundGrass);
  stageAskName.addLayer(layerAskName);

  let stageLeaderboard = new Stage("leaderBoard");
  stageLeaderboard.addLayer(layerBackground);
  stageLeaderboard.addLayer(layerGroundGrass);
  stageLeaderboard.addLayer(layerLeaderboard);

  let stageGameOver = new Stage("gameover");
  stageGameOver.addLayer(layerBackground);
  stageGameOver.addLayer(layerGroundGrass);
  stageGameOver.addLayer(layerMenu);
  stageGameOver.addLayer(layerGameOver);

  game.addStage(stageAskName);
  game.addStage(stageLeaderboard);
  game.addStage(stageReady);
  game.addStage(stagePlay);
  game.addStage(stageGameOver);
  game.start();

  /* 
   FAKE SCORES TEMP
  */

  let fakeScores = [
    { name: "JOJO", score: "193" },
    { name: "VADER", score: "57" },
    { name: "FRANK", score: "9" },
  ];
  localStorage.setItem("scores", JSON.stringify(fakeScores));
};
