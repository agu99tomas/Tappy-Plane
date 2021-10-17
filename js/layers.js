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

class LayerMenu extends Layer {
  start(canvas, objs) {
    objs.cup.y = 10;
    objs.cup.x = canvas.width - objs.cup.currentImage.width - 15;
  }
  loop(canvas, objs) {
    canvas.draw(objs.cup);
  }
}

class LayerAskName extends Layer {
  start(canvas, objs) {
    this.nextStage = false;
    this.canNextStage = false;
    this.alpha = 1;

    objs.cup.y = 10;
    objs.cup.x = canvas.width - objs.cup.currentImage.width - 15;

    objs.tap.centerX(canvas);
    objs.tap.y = 400;
    this.tapVisible = false;

    this.askName = new Paragraph("Write your name", 70);
    objs.alphabet.appendParagraph(this.askName);

    this.playerName = new Paragraph("", 220);
    this.playerName.limit = 5;
    objs.alphabet.appendParagraph(this.playerName);
  }
  loop(canvas, objs) {
    if (this.nextStage) {
      this.fade(canvas);
    }
    if (this.tapVisible) {
      canvas.draw(objs.tap);
    }
    canvas.draw(objs.alphabet); 
    canvas.ctx.globalAlpha = 1.0;
    if (this.canNextStage) {
      objs.plane.playerName = this.playerName.text;
      this.changeStage("getReady");
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
    if (e.type == "keydown") {
      this.playerName.appendLetter(e.key);
      if (this.playerName.text.length >= 1) {
        this.tapVisible = true;
      }else{
        this.tapVisible = false;
      }
    }
    if (e.type == 'click') {
      if (this.tapVisible) {
        this.nextStage = true;
      }
    }
  }
}
