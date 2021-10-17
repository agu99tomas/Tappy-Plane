class ObjectPlane extends Object2D {
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
    let scoreAsString = this.score.toString().split('');
    let scoreDigits = scoreAsString.map(Number);
    let currentScore = scoreDigits.map(n => this.images[n]);

    return currentScore;
  }

  countScore(){
  }

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
