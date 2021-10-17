class Plane extends Object2D {
  constructor(id, animationSpeed = 2) {
    super(id, (animationSpeed = 2));
    this.drop = -6;
    this.jumpForce = 5;
    this.gravity = 0.1;
    this.gameover = false;
    this.disappeared = false;
    this.gameStart = false;
  }

  jump() {
    if (this.drop <= 2) {
      this.drop += this.jumpForce;
    }
  }

  events(e) {
    if (e.type == "click") {
      this.jump();
    }
  }

  fall() {
    this.y -= this.drop;
    this.drop -= this.gravity;
  }

  draw(canvas) {
    if (this.gameover) {
      this.lostAndGoLeft();
    }
    if (this.gameStart) {
      this.fall();
    }
    super.draw(canvas);
  }

  lostAndGoLeft() {
    this.x -= 4;
    this.disappeared = this.currentImage.width + this.x < 0;
  }
}

class LayerPlay extends Layer {
  start(canvas, objs) {
    objs.plane.gameStart = true;
  }

  loop(canvas, objs) {
    canvas.draw(objs.plane);
  }
}

class LayerReady extends Layer {
  start(canvas, objs) {
    this.nextStage = false;
    this.canNextStage = false;
    this.alpha = 1;

    objs.tap.centerX(canvas);
    objs.tap.y = 300;

    objs.plane.centerY(canvas);
    objs.plane.x = 100;

    objs.textGetReady.centerX(canvas);
    objs.textGetReady.y = 100;
  }

  loop(canvas, objs) {
    canvas.draw(objs.plane);
    if (this.nextStage) {
      this.fade(canvas);
    }
    canvas.draw(objs.tap);
    canvas.draw(objs.textGetReady);
    canvas.ctx.globalAlpha = 1.0;

    if (this.canNextStage) {
      this.changeStage("play");
    }
  }

  fade(canvas) {
    if (this.alpha > 0){
        this.alpha -= 0.04;
    }

    if (this.alpha < 0) {
      this.alpha = 0;
      this.canNextStage = true;
    }

    canvas.ctx.globalAlpha = this.alpha;
  }

  events(e) {
    if (e.type == "click") {
      this.nextStage = true;
    }
  }
}

window.onload = () => {
  let canvas = new Canvas("canvas", 800, 480);
  let game = new Game(canvas);

  //// Game objects ////
  let objPlane = new Plane("plane");
  objPlane.addImage("planeYellow1.png");
  objPlane.addImage("planeYellow2.png");
  objPlane.addImage("planeYellow3.png");

  let objTapRight = new Object2D("tap");
  objTapRight.addImage("tapRight.png");

  let objLeaderboard = new Object2D("leaderboard");
  objLeaderboard.addImage("leaderboards.png");

  let objButton = new Object2D("button");
  objButton.addImage("button.png");

  let objtextGetReady = new Object2D("textGetReady");
  objtextGetReady.addImage("textGetReady.png");

  game.addObject(objPlane);
  game.addObject(objTapRight);
  game.addObject(objLeaderboard);
  game.addObject(objButton);
  game.addObject(objtextGetReady);

  //// Layers ////
  let layerBackground = new Background("background.png", 1);
  let layerGroundGrass = new Background("groundGrass.png", 4);
  let layerReady = new LayerReady();
  let layerPlay = new LayerPlay();

  //// Stages ////
  let stageReady = new Stage("getReady");
  stageReady.addLayer(layerBackground);
  stageReady.addLayer(layerGroundGrass);
  stageReady.addLayer(layerReady);

  let stagePlay = new Stage("play");
  stagePlay.addLayer(layerBackground);
  stagePlay.addLayer(layerGroundGrass);
  stagePlay.addLayer(layerPlay);

  game.addStage(stageReady);
  game.addStage(stagePlay);

  game.setStage("getReady");
  game.start();
};
