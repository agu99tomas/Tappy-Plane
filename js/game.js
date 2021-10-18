window.onload = () => {
  let canvas = new Canvas("canvas", 800, 480);
  let game = new Game(canvas);

  //// Game objects ////
  let objPlane = new ObjectPlane("plane");
  objPlane.addImages("planeYellow1.png","planeYellow2.png","planeYellow3.png");

  let objTapRight = new Object2D("tap");
  objTapRight.addImage("tapRight.png");

  let objCup = new Object2D("cup");
  objCup.addImage("cup.png");

  let objtextGetReady = new Object2D("textGetReady");
  objtextGetReady.addImage("textGetReady.png");

  let collectionScore = new CollectionScore("score");
  for (let i = 0; i <= 9; i++) {
    collectionScore.addImage("number" + i + ".png");
  }

  let writer = new Writer('writer');
  writer.loadImages();

  game.addObject(objPlane);
  game.addObject(objTapRight);
  game.addObject(objCup);
  game.addObject(objtextGetReady);
  game.addObject(collectionScore);
  game.addObject(writer);

  //// Layers ////
  let layerBackground = new Background("background.png", 1);
  let layerGroundGrass = new Background("groundGrass.png", 4);
  let layerReady = new LayerReady();
  let layerPlay = new LayerPlay();
  let layerMenu = new LayerMenu();
  let layerAskName = new LayerAskName();
  let layerLeaderboard = new LayerLeaderboard();

  //// Stages ////
  let stageReady = new Stage("getReady");
  stageReady.addLayer(layerBackground);
  stageReady.addLayer(layerGroundGrass);
  stageReady.addLayer(layerReady);
  stageReady.addLayer(layerMenu);

  let stagePlay = new Stage("play");
  stagePlay.addLayer(layerBackground);
  stagePlay.addLayer(layerGroundGrass);
  stagePlay.addLayer(layerPlay);

  let stageAskName = new Stage("askName");
  stageAskName.addLayer(layerBackground);
  stageAskName.addLayer(layerGroundGrass);
  stageAskName.addLayer(layerAskName);

  let stageLeaderboard = new Stage("leaderBoard");
  stageLeaderboard.addLayer(layerBackground);
  stageLeaderboard.addLayer(layerGroundGrass);
  stageLeaderboard.addLayer(layerLeaderboard);

  game.addStage(stageAskName);
  game.addStage(stageLeaderboard);
  game.addStage(stageReady);
  game.addStage(stagePlay);
  game.start();

  /* 
  
  */
 
  let fakeScores = [
    {name: 'JOJO', score : '193'},
    {name: 'VADER', score : '57'},
    {name: 'FRANK', score : '9'}
  ]
  localStorage.setItem("scores",  JSON.stringify(fakeScores));
  
};
