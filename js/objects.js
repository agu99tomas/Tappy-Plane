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
    this.disappeared = this.currentImage.width + this.x < 0;
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
  constructor(text = "", y = 0) {
    this.y = y;
    this.text = text;
    this.spaceSize = 20;
    this.limit = -1;
    this.allowsSpaces = false;
  }

  appendLetter(letter) {
    if (letter == 'Backspace') {
      this.text = this.text.slice(1, this.text.length); 
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

class CollectionAlphabet extends CollectionImage {
  constructor(id) {
    super(id);

    this.fileNames = Alphabet.alphabet.map((l) => `letter${l}.png`);
    this.paragraphs = [];
  }

  appendParagraph(paragraph) {
    this.paragraphs.push(paragraph);
  }

  getLetterAsImage(letter) {
    return this.images[Alphabet.alphabet.indexOf(letter.toUpperCase())];
  }

  getTextAsImage(text) {
    let letters = text.split(""); // ['w', 'r', 'i', 't', 'e', ' ', 'y', 'o', 'u', 'r', ' ', 'n', 'a', 'm', 'e']
    let textAsImage = letters.map((l) => this.getLetterAsImage(l));
    return textAsImage;
  }

  writeParagraph(paragraph, canvas) {
    let paragraphAsImage = this.getTextAsImage(paragraph.text);
    let totalWidth = paragraphAsImage.reduce((sum, img) => {
      if (img !== undefined) {
        return sum + img.width;
      } else {
        return sum + paragraph.spaceSize; // unrecognized space or character
      }
    }, 0);
    let nextPositionX = canvas.width / 2 - totalWidth / 2;

    paragraphAsImage.forEach((img) => {
      if (img === undefined) {
        nextPositionX += paragraph.spaceSize; // unrecognized space or character
      } else {
        canvas.drawImage(img, nextPositionX, paragraph.y);
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
