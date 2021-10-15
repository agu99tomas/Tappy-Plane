
class TappyPlaneGame extends Game {

    loadAllStages() {
        this.addStage('getReady', new StageGetReady());
        this.addStage('play', new StagePlay());
        this.addStage('gameOver', new StageGameOver());
    }

    startGame() {
        this.loadAllGameObjects();
        this.loadAllStages();
        this.setStage('getReady');
    }

    loadAllGameObjects() {

        let gameObjectBackground = new StaticGameObject('background', 'background.png');
        this.addGameObject(gameObjectBackground);

        let gameObjectGround = new StaticGameObject('ground', 'groundGrass.png');
        this.addGameObject(gameObjectGround);

        let gameObjectRock = new StaticGameObject('rock', 'rockGrass.png');
        let multipleGameObjectRock = new RocksCollection('rocks', gameObjectRock);
        this.addGameObject(multipleGameObjectRock);

        let gameObjectRockDown = new StaticGameObject('rockDown', 'rockGrassDown.png');
        let multipleGameObjectRockDown = new RocksDownCollection('rocksDown', gameObjectRockDown);
        this.addGameObject(multipleGameObjectRockDown);

        // UI
        let gameObjectTextGetReady = new StaticGameObject('textGetReady', 'textGetReady.png');
        this.addGameObject(gameObjectTextGetReady);

        let gameObjectTextGameOver = new StaticGameObject('textGameOver', 'textGameOver.png');
        this.addGameObject(gameObjectTextGameOver);

        let gameObjectTapRight = new StaticGameObject('tapRight', 'tapRight.png');
        this.addGameObject(gameObjectTapRight);

        let score = new Score('score');
        for (let i = 0; i <= 9; i++) {
            score.loadImage('number'+i+'.png');            
        }
        this.addGameObject(score);

        // Game
        let gameImagesPlaneYellow = ['planeYellow1.png', 'planeYellow2.png', 'planeYellow3.png'];
        let gameObjectPlaneYellow = new PlaneYellow('planeYellow', gameImagesPlaneYellow, 2);
        this.addGameObject(gameObjectPlaneYellow);

    }


    drawAsBackground(gameObject, velocity) {

        this.drawObject(gameObject, gameObject.x, this.height - gameObject.image.height);

        this.drawObject(gameObject, gameObject.x + gameObject.image.width, this.height - gameObject.image.height);

        gameObject.x -= velocity;
        if (gameObject.x == gameObject.image.width * -1) gameObject.x = 0;
    }

    drawBackground() {
        this.drawAsBackground(this.background, 1);
        this.drawAsBackground(this.ground, 4);
    }
}



class RocksCollection extends CollectionGameObject {
    draw(game) {
        let removeRocks = []
        game.rocks.objects.forEach(rock => {
            rock.x -= 4;
            if (rock.x + rock.image.width <= 0){
                removeRocks.push(rock);
                game.score.score++;
            }
        });
        game.rocks.removeAll(removeRocks);
    }

}

class RocksDownCollection extends CollectionGameObject {
    draw(game) {
        let removeRocksDown = []
        game.rocksDown.objects.forEach(rockDown => {
            rockDown.x -= 4;
            if (rockDown.x + rockDown.image.width <= 0){
                removeRocksDown.push(rockDown);
                game.score.score++;
            }
        });
        game.rocksDown.removeAll(removeRocksDown);
    }

}


class Score extends CollectionImage {

    constructor(id){
        super(id);
        this.score = 0;
    }

    getScoreAsImage(){
        let scoreAsString = this.score.toString().split('');
        let scoreDigits = scoreAsString.map(Number);
        let currentScore = [];

        scoreDigits.forEach(i => {
            currentScore.push(this.images[i]);
        });

        return currentScore;
    }

    drawScore(game){
        let scoreImages = this.getScoreAsImage();
        let totalScoreWidth = scoreImages.reduce((sum, img) => sum + img.width, 0); 
        let scoreX = (game.width/ 2) - totalScoreWidth / 2;

        scoreImages.forEach(img => {
            game.drawImage(img, scoreX ,10);
            scoreX += img.width;
        });

        
    }


}


class PlaneYellow extends AnimatedGameObject {
    constructor(id, imageFileNames, animationSpeed) {
        super(id, imageFileNames, animationSpeed);
        this.drop = -6;
        this.jumpForce = 5;
        this.gravity = 0.1;
    }

    jump() {
        if (this.drop <= 2) this.drop += this.jumpForce;
    }

    fall() {
        this.y -= this.drop;
        this.drop -= this.gravity;
    }

    draw(game) {

    }

    hasCollision(game) {
        let detectedCollision = false;

        game.rocksDown.objects.forEach(rock => {
            if (game.planeYellow.collision(rock, 15, 15, 100, 0, game, false))
                detectedCollision = true;
        });

        game.rocks.objects.forEach(rock => {
            if (game.planeYellow.collision(rock, 15, 15, 100, 0, game, false))
                detectedCollision = true;
        });

        // Has Collision with ground
        if ((game.planeYellow.y + game.planeYellow.image.height) >= (game.height - game.ground.image.height) + 40) {
            detectedCollision = true;
        }

        return detectedCollision;
    }

    lostAndGoLeft(game) {
        game.planeYellow.x -= 4;
        return game.planeYellow.image.width + game.planeYellow.x < 0
    }

}



class StageGetReady extends Stage {

    start(game) {
        this.nextStage = false;
        this.canNextStage = false;
        this.alpha = 1;

        game.textGetReady.y = 100;
        game.centerX(game.textGetReady);

        game.tapRight.y = 300;
        game.centerX(game.tapRight);


        game.planeYellow.x = 100;
        game.centerY(game.planeYellow);


        Events.addEventListener(Events.clickOnCanvas, e => {
            this.nextStage = true;
        });

    }

    draw(game) {
        game.clear();
        game.drawBackground();
        game.drawObject(game.planeYellow);

        if (this.nextStage) {
            if (this.alpha > 0) this.alpha -= 0.04;

            if (this.alpha < 0) {
                this.alpha = 0;
                this.canNextStage = true;
            }

            game.ctx.globalAlpha = this.alpha;
        }

        game.drawObject(game.textGetReady);
        game.drawObject(game.tapRight)

        game.ctx.globalAlpha = 1.0;

        if (this.canNextStage) game.setStage('play');

    }
}

class StagePlay extends Stage {

    start(game) {
        this.nextStage = false;
        this.canNextStage = false;

        game.planeYellow.drop = -6;


        Events.addEventListener(Events.clickOnCanvas, e => {
            game.planeYellow.jump();
        });

        this.generateRandomRocks(game);
    }

    draw(game) {

        game.clear();

        game.drawAsBackground(game.background, 1);

        game.drawCollectionGameObject(game.rocks);

        game.drawCollectionGameObject(game.rocksDown);

        game.drawObject(game.planeYellow);

        game.drawAsBackground(game.ground, 4);

        game.score.drawScore(game);

        if (game.planeYellow.hasCollision(game)) {
            this.nextStage = true;
        }

        if (this.nextStage) {
            this.canNextStage = game.planeYellow.lostAndGoLeft(game);
        } else {
            game.planeYellow.fall();
        }

        if (this.canNextStage) {
            clearInterval(this.interval);
            game.setStage('gameOver');
        }

    }

    generateRandomRocks(game) {
        game.rocks.clear();
        game.rocksDown.clear();

        game.rocks.base.x = game.width + game.rocks.base.image.width;
        game.rocks.base.y = game.height - game.rocks.base.image.height;
        game.rocks.add()

        game.rocksDown.base.x = game.width + game.rocksDown.base.image.width;

        setTimeout(() => {
            game.rocksDown.base.y = 0 - Random.randomInt(0, game.rocksDown.base.image.height * 0.30);
            game.rocksDown.add()
        }, Random.randomInt(1000, 2000));

        this.interval = setInterval(() => {
            game.rocks.base.y = (game.height - game.rocks.base.image.height) + Random.randomInt(0, game.rocks.base.image.height * 0.20);
            game.rocks.add()

            setTimeout(() => {
                game.rocksDown.base.y = 0 - Random.randomInt(0, game.rocksDown.base.image.height * 0.30);
                game.rocksDown.add();
            }, Random.randomInt(1000, 2000));

        }, 3000);
    }

}


class StageGameOver extends Stage {

    start(game) {
        this.nextStage = false;
        this.canNextStage = false;
        this.alpha = 0;
        this.animationEnd = false;
        game.planeYellow.x = game.planeYellow.image.width * -1;
        game.centerY(game.planeYellow);


        game.textGameOver.y = 100;
        game.centerX(game.textGameOver);

        Events.addEventListener(Events.clickOnCanvas, e => {
            if (this.animationEnd) this.nextStage = true;
        });
    }

    draw(game) {
        game.clear();
        game.drawBackground();

        if (this.alpha < 1 && !this.nextStage) this.alpha += 0.04;

        if (game.planeYellow.x < 100) {
            game.planeYellow.x += 4;

        } else {
            this.animationEnd = true;
        }

        game.drawObject(game.planeYellow);

        if (this.nextStage) {
            if (this.alpha > 0) this.alpha -= 0.04;

            if (this.alpha < 0) {
                this.alpha = 0;
                this.canNextStage = true;
            }

        }

        game.ctx.globalAlpha = this.alpha;
        game.drawObject(game.textGameOver);
        game.drawObject(game.tapRight);
        game.ctx.globalAlpha = 1;

        if (this.canNextStage)
            game.setStage('play');

    }
}


window.onload = () => {
    let game = new TappyPlaneGame();
    game.startGame();
};


