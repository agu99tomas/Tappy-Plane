class ObjectPlane extends Object2D {
  constructor(id, animationSpeed = 2) {
    super(id, (animationSpeed = 2));
    this.drop = -6;
    this.jumpForce = 5;
    this.gravity = 0.1;
    this.gameover = false;
    this.disappeared = false;
    this.gameStart = false;
    this.playerName = "Player";
  }

  jump() {
    if (this.drop <= 2) {
      this.drop += this.jumpForce;
    }
  }

  events(e) {
    if (e.type == "click" && this.gameStart) {
      this.jump();
    }
  }

  fallOrJump() {
    this.y -= this.drop;
    this.drop -= this.gravity;
  }

  draw(canvas) {
    if (this.gameover) {
      this.lostAndGoLeft();
    }
    if (this.gameStart) {
      this.fallOrJump();
    }
    super.draw(canvas);
  }

  lostAndGoLeft() {
    this.x -= 4;
    this.disappeared = this.width + this.x < 0;
  }
}

class CollectionScore extends CollectionImage {
  constructor(id) {
    super(id);
    this.score = 0;
  }

  getScoreAsImage() {
    let scoreAsString = this.score.toString().split("");
    let scoreDigits = scoreAsString.map(Number);
    let currentScore = scoreDigits.map((n) => this.images[n]);

    return currentScore;
  }

  countScore() {}

  draw(canvas) {
    let scoreImages = this.getScoreAsImage();
    let totalScoreWidth = scoreImages.reduce((sum, img) => sum + img.width, 0);
    let scoreX = canvas.width / 2 - totalScoreWidth / 2;

    scoreImages.forEach((img) => {
      canvas.drawImage(img, scoreX, 10);
      scoreX += img.width;
    });
  }
}

class Alphabet {
  static alpha = Array.from(Array(26)).map((e, i) => i + 65);
  static alphabet = Alphabet.alpha.map((x) => String.fromCharCode(x)); // ["A", "B", "C", "D", "E", "F", "G", "H"...
  static includes(letter) {
    return Alphabet.alphabet.includes(letter.toUpperCase());
  }
}

class Paragraph {
  constructor(text = "", x = 0, y = 0) {
    this.y = y;
    this.x = x;
    this.text = text;
    this.spaceSize = 20;
    this.limit = -1;
    this.allowsSpaces = false;
  }

  appendLetter(letter) {
    if (letter == "Backspace") {
      this.text = this.text.slice(0, -1);
    }

    if (this.limit == this.text.length) {
      return;
    }

    if (!this.allowsSpaces && letter == " ") {
      return;
    }

    if (Alphabet.includes(letter) || letter == " ") {
      this.text += letter;
    }
  }
}

class Writer extends CollectionImage {
  constructor(id) {
    super(id);

    this.fileNames = Alphabet.alphabet.map((l) => `letter${l}.png`);
    this.paragraphs = [];
    this.alphabetImages = [];
    this.numberImages = [];
  }

  removeParagraphs(){
    this.paragraphs = [];
  }

  addAlphabetImages() {
    this.fileNames.forEach((fileName) => {
      let newImage = new Image2D(fileName);
      this.alphabetImages.push(newImage);
    });
  }

  addNumberImages() {
    for (let i = 0; i <= 9; i++) {
      let fileName = "number" + i + ".png";
      let newImage = new Image2D(fileName);
      this.numberImages.push(newImage);
    }
  }

  loadImages() {
    this.addAlphabetImages();
    this.addNumberImages();
  }

  appendParagraph(paragraph) {
    this.paragraphs.push(paragraph);
  }

  getLetterAsImage(letter) {
    return this.alphabetImages[Alphabet.alphabet.indexOf(letter.toUpperCase())];
  }

  getNumberAsImage(number) {
    return this.numberImages[number];
  }

  getTextAsImage(text) {
    let letters = text.split(""); // ['w', 'r', 'i', 't', 'e', ' ', 'y', 'o', 'u', 'r', ' ', 'n', 'a', 'm', 'e']
    let textAsImage = letters.map((l) => {
      if (isFinite(l)) {
        return this.getNumberAsImage(l);
      }
      return this.getLetterAsImage(l);
    });
    return textAsImage;
  }

  writeParagraph(paragraph, canvas, customX = false) {
    let paragraphAsImage = this.getTextAsImage(paragraph.text);
    let totalWidth = paragraphAsImage.reduce((sum, img) => {
      if (img !== undefined) {
        return sum + img.width;
      } else {
        return sum + paragraph.spaceSize; // unrecognized character or space
      }
    }, 0);
    let nextPositionX = canvas.width / 2 -  (totalWidth / 2) + paragraph.x

    paragraphAsImage.forEach((img) => {
      if (img === undefined) {
        nextPositionX += paragraph.spaceSize; // unrecognized character or space
      } else {
        canvas.drawImage(img, nextPositionX, paragraph.y - img.height);
        nextPositionX += img.width;
      }
    });
  }

  draw(canvas) {
    this.paragraphs.forEach((paragraph) => {
      this.writeParagraph(paragraph, canvas);
    });
  }
}
