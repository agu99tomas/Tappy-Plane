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
    //bjs.tap.y = 300;

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

    this.askName = new Paragraph("Write your name", 0, 150);
    objs.writer.appendParagraph(this.askName);

    this.playerName = new Paragraph("", 0, 320);
    this.playerName.limit = 5;
    objs.writer.appendParagraph(this.playerName);
  }
  loop(canvas, objs) {
    if (this.tapVisible) {
      canvas.draw(objs.tap);
    }
    if (this.nextStage) {
      this.fade(canvas);
    }
    canvas.draw(objs.writer);
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
      } else {
        this.tapVisible = false;
      }
    }
    if (e.type == "click") {
      if (this.tapVisible) {
        this.nextStage = true;
      }
    }
  }
}

class LayerLeaderboard extends Layer {
  start(canvas, objs){
    this.nextStage = false;
    this.canNextStage = false;
    this.alpha = 1;

    objs.tap.centerX(canvas);
    objs.tap.y = 400;
    
    objs.medalGold.y = 150 - objs.medalGold.currentImage.height;
    objs.medalGold.x = 120;

    objs.medalSilver.y = 250 - objs.medalSilver.currentImage.height;
    objs.medalSilver.x = 120;

    objs.medalBronze.y = 350 - objs.medalBronze.currentImage.height;
    objs.medalBronze.x = 120;

    this.firstPosition = new Paragraph("193 tomas", 30, 150);
    this.secondPosition = new Paragraph("90 franc", 30, 250);
    this.thirdPosition = new Paragraph("9 vader", 30, 350);


    objs.writer.appendParagraph(this.firstPosition);
    objs.writer.appendParagraph(this.secondPosition);
    objs.writer.appendParagraph(this.thirdPosition);
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

  loop(canvas, objs){
    canvas.draw(objs.tap);
    if (this.nextStage) {
      this.fade(canvas);
    }
    canvas.draw(objs.writer);
    canvas.draw(objs.medalGold);
    canvas.draw(objs.medalBronze);
    canvas.draw(objs.medalSilver);

    canvas.ctx.globalAlpha = 1.0;
    if (this.canNextStage) {
      this.changeStage("getReady");
    }
  }

  events(e) {
    if (e.type == "click") {
      this.nextStage = true;
    }
  }
}
