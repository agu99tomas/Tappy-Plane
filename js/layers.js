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
    objs.plane.centerY(canvas);
    objs.plane.x = 100;

    objs.textGetReady.centerX(canvas);
    objs.textGetReady.y = 100;
  }

  loop(canvas, objs) {
    canvas.draw(objs.plane);
    canvas.draw(objs.tap);
    canvas.draw(objs.textGetReady);
  }

  events(e, canvas, objs) {
    if (e.type == "click") {
      let position = canvas.getCursorPosition(e);
      let cupClicked = objs.cup.clicked(position.x, position.y)
      if (cupClicked) {
        this.changeStage("leaderBoard");
      }else{
        this.changeStage("play");
      }
    }
  }
}

class LayerMenu extends Layer {
  start(canvas, objs) {
    objs.cup.y = 10;
    objs.cup.x = canvas.width - objs.cup.width - 15;
  }
  loop(canvas, objs) {
    canvas.draw(objs.cup);
  }
}

class LayerAskName extends Layer {
  start(canvas, objs) {
    objs.writer.removeParagraphs();
    
    objs.tap.centerX(canvas);
    objs.tap.y = 400;
    objs.tap.visible = false; 

    this.askName = new Paragraph("Write your name", 0, 150);
    objs.writer.appendParagraph(this.askName);

    this.playerName = new Paragraph("", 0, 320);
    this.playerName.limit = 5;
    objs.writer.appendParagraph(this.playerName);
  }
  loop(canvas, objs) {
    if (objs.tap.visible) {
      canvas.draw(objs.tap);
    }
    canvas.draw(objs.writer);
  }

  events(e, canvas, objs) {
    if (e.type == "keydown") {
      this.playerName.appendLetter(e.key);
      objs.tap.visible = this.playerName.text.length >= 1;
    }
    if (e.type == "click") {
      if (objs.tap.visible) {
        objs.plane.playerName = this.playerName.text;
        this.changeStage("getReady");
      }
    }
  }
}

class LayerLeaderboard extends Layer {
  start(canvas, objs) {
    objs.writer.removeParagraphs();

    this.firstPosition = new Paragraph("193 tomas", 0, 150);
    this.secondPosition = new Paragraph("90 franc", 0, 250);
    this.thirdPosition = new Paragraph("9 vader", 0, 350);

    objs.writer.appendParagraph(this.firstPosition);
    objs.writer.appendParagraph(this.secondPosition);
    objs.writer.appendParagraph(this.thirdPosition);
  }


  loop(canvas, objs) {
    canvas.draw(objs.tap);
    canvas.draw(objs.writer);
  }

  events(e, canvas, objs) {
    if (e.type == "click") {
      this.changeStage("getReady");
    }
  }
}
