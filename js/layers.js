class LayerPlay extends Layer {
  start(canvas, objs) {
    objs.plane.gameover = false; // deberia ser una atributo de la clase game
    objs.plane.gameStart = true; // same
    objs.plane.drop = 0; // los objetos deberian instanciarse por layer para evitar este tipo de cosas...
    objs.plane.centerY(canvas);

    this.score = 0;
    objs.writer.removeParagraphs();
    this.textCore = new Paragraph(this.score, 0, 90);
    objs.writer.appendParagraph(this.textCore);

    this.rocks = [];
    this.timeouts1 = [];
    this.timeouts2 = [];
    this.generateRandomRocks(objs);
  }

  loop(canvas, objs) {
    canvas.draw(objs.plane);
    this.rocks.forEach((rock) => {
      canvas.drawImage(rock.currentImage, rock.x, rock.y); // al clonar el objeto se pierden los metodos...
      // La redimension del box deberia hacerse en el contructor
      objs.plane.box.width = 75;
      objs.plane.box.height = 60;
      rock.box.width = 5;

      if (objs.plane.hasCollision(rock, canvas, true)) {
        this.clearAllTimeOut();
        objs.plane.gameover = true;
        this.changeStage("gameover");
      }
    });
    this.moveRocks();
    this.countScore(objs);
    canvas.draw(objs.writer);
  }

  moveRocks() {
    this.rocks = this.rocks.filter((r) => {
      r.x -= 4;
      return r.x + r.width > 0;
    });
  }

  newRock(objs) {
    // no se deberian clonar los objectos (se pierden los metodos), los objetos deberian instanciarse dentro de los layers
    let cloneRock = Object.assign({}, objs.rock);
    cloneRock.x = canvas.width + cloneRock.width;
    cloneRock.y =
      canvas.height -
      cloneRock.height +
      Random.randomInt(0, cloneRock.height * 0.2);
    this.rocks.push(cloneRock);
  }

  newRockDown(objs) {
    let cloneRockDown = Object.assign({}, objs.rockDown);
    cloneRockDown.x = canvas.width + cloneRockDown.width;
    cloneRockDown.y = 0 - Random.randomInt(0, cloneRockDown.height * 0.3);
    this.rocks.push(cloneRockDown);
  }

  generateRandomRocks(objs) {
    this.timeouts1.push(
      setTimeout(() => {
        this.newRock(objs);
        this.timeouts2.push(
          setTimeout(() => {
            this.newRockDown(objs);
            this.generateRandomRocks(objs);
          }, Random.randomInt(1000, 1500))         
        );
      }, Random.randomInt(1000, 1800))
    );
  }

  clearAllTimeOut() {
    for (var i = 0; i < this.timeouts1.length; i++) {
      clearTimeout(this.timeouts1[i]);
    }
    for (var i = 0; i < this.timeouts2.length; i++) {
      clearTimeout(this.timeouts2[i]);
    }
  }
  countScore(objs) {
    this.rocks.forEach((rock) => {
      let endXRock = rock.x + rock.width;

      if (endXRock <= objs.plane.x && !rock.scoreCounted) {
        this.score++;
        this.textCore.text = this.score;
        rock.scoreCounted = true;
      }
    });
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
      let tapClicked = objs.tap.clicked(position.x, position.y);
      if (tapClicked) {
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
  events(e, canvas, objs) {
    if (e.type == "click") {
      let position = canvas.getCursorPosition(e);
      let cupClicked = objs.cup.clicked(position.x, position.y);
      if (cupClicked) {
        this.changeStage("leaderBoard");
      }
    }
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

        let position = canvas.getCursorPosition(e);
        let tapClicked = objs.tap.clicked(position.x, position.y);
        if (tapClicked) {
          this.changeStage("getReady");

          // It should be an attribute of the Game class.
          let bgSound = new Audio("sounds/music.mp3");
          bgSound.loop = true;
          bgSound.play();
          //
        }
      }
    }
  }
}

class LayerLeaderboard extends Layer {
  constructor() {
    super();
  }

  start(canvas, objs) {
    objs.writer.removeParagraphs();

    let scores = JSON.parse(localStorage.getItem("scores") || "[]");
    console.log(scores[0]);

    this.firstPosition = new Paragraph(
      `${scores[0].score} ${scores[0].name}`,
      0,
      150
    );
    this.secondPosition = new Paragraph(
      `${scores[1].score} ${scores[1].name}`,
      0,
      250
    );
    this.thirdPosition = new Paragraph(
      `${scores[2].score} ${scores[2].name}`,
      0,
      350
    );

    objs.writer.appendParagraph(this.firstPosition);
    objs.writer.appendParagraph(this.secondPosition);
    objs.writer.appendParagraph(this.thirdPosition);
  }

  loop(canvas, objs) {
    canvas.draw(objs.tap);
    canvas.draw(objs.writer);
  }

  message(message) {
    if (message !== undefined) {
      this.nextStage = message;
    }
  }

  events(e, canvas, objs) {
    if (e.type == "click") {
      let position = canvas.getCursorPosition(e);
      let tapClicked = objs.tap.clicked(position.x, position.y);
      if (objs.plane.gameover) {
        this.changeStage("gameover");
      } else {
        this.changeStage("getReady");
      }
    }
  }
}

class LayerGameOver extends Layer {
  start(canvas, objs) {
    objs.textGameOver.centerX(canvas);
    objs.textGameOver.y = 100;
    objs.plane.centerY(canvas);
  }

  loop(canvas, objs) {
    canvas.draw(objs.textGameOver);
    canvas.draw(objs.tap);
    canvas.draw(objs.plane);
  }

  events(e, canvas, objs) {}

  events(e, canvas, objs) {
    if (e.type == "click") {
      let position = canvas.getCursorPosition(e);
      let tapClicked = objs.tap.clicked(position.x, position.y);
      if (tapClicked) {
        this.changeStage("play");
      }
    }
  }
}
