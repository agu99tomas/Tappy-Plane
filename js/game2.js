

class LayerReady extends Layer {

  start(canvas) {

    this.tap.centerX(canvas);
    this.tap.y = 300;

    this.plane.centerY(canvas);
    this.plane.x = 100;

    this.textGetReady.centerX(canvas);
    this.textGetReady.y = 100;
  }

  loop(canvas) {
    canvas.draw(this.plane);
    canvas.draw(this.tap);
    canvas.draw(this.textGetReady);
  }

  events(e){
      console.log(e)
  }
}

window.onload = () => {
  let canvas = new Canvas("canvas", 800, 480);
  let game = new Game(canvas);

  //// Game objects ////
  let objPlane = new Object2D("plane");
  objPlane.addImage("planeYellow1.png");
  objPlane.addImage("planeYellow2.png");
  objPlane.addImage("planeYellow3.png");
  
  let objTapRight = new Object2D("tap");
  objTapRight.addImage('tapRight.png');
  
  let  objLeaderboard = new Object2D('leaderboard');
  objLeaderboard.addImage('leaderboards.png');
  
  let objButton = new Object2D('button');
  objButton.addImage('button.png');
  
  let objtextGetReady = new Object2D('textGetReady');
  objtextGetReady.addImage('textGetReady.png');

  game.addObject(objPlane);
  game.addObject(objTapRight);
  game.addObject(objLeaderboard);
  game.addObject(objButton);
  game.addObject(objtextGetReady);

  //// Layers ////
  let layerBackground = new Background("background.png", 1);
  let layerGroundGrass = new Background("groundGrass.png", 4);
  let layerReady = new LayerReady();

  //// Stages ////
  let stageReady = new Stage("getReady");
  stageReady.addLayer(layerBackground);
  stageReady.addLayer(layerGroundGrass);
  stageReady.addLayer(layerReady);


  game.addStage(stageReady);

  game.setStage("getReady");
  game.start();

  const event = new Event('build');
  event.id = {id : 'as'} ;
  console.log(event)
};
