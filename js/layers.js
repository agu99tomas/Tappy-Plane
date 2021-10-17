class LayerPlay extends Layer {
    start(canvas, objs) {
      objs.plane.gameStart = true;
    }
  
    loop(canvas, objs) {
      canvas.draw(objs.plane);
      canvas.draw(objs.score);
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
      if (this.alpha > 0) {
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