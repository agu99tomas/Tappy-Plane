
class RocksCollection extends CollectionGameObject {
    draw(game) {
        game.rocks.objects.forEach(rock => {
            rock.x -= 4;
            if (rock.x + rock.image.width <= 0)
                game.rocks.remove(rock);
        });
    }
}

class RocksDownCollection extends CollectionGameObject {
    draw(game) {
        game.rocksDown.objects.forEach(rockDown => {
            rockDown.x -= 4;
            if (rockDown.x + rockDown.image.width <= 0)
                game.rocksDown.remove(rockDown);
        });
    }
}

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
        // Background
        let gameObjectBackground = new StaticGameObject('background', 'background.png');
        this.addGameObject(gameObjectBackground);

        // Ground
        let gameObjectGround = new StaticGameObject('ground', 'groundGrass.png');
        this.addGameObject(gameObjectGround);

        // Rocks
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

        // Game
        let gameImagesPlaneYellow = ['planeYellow1.png', 'planeYellow2.png', 'planeYellow3.png'];
        let gameObjectPlaneYellow = new AnimatedGameObject('planeYellow', gameImagesPlaneYellow, 2);
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


class StageGetReady extends Stage {

    start(game) {
        this.nextStage = false;
        this.canNextStage = false;
        this.alpha = 1;
        game.planeYellow.x = 100;
        game.textGetReady.y = 100;
        game.tapRight.y = 300;

        Events.addEventListener(Events.clickOnCanvas, e => {
            this.nextStage = true;
        });

    }

    draw(game) {
        game.clear();
        game.drawBackground();
        game.drawAndCenterY(game.planeYellow);

        if (this.nextStage) {
            if (this.alpha > 0) this.alpha -= 0.04;

            if (this.alpha < 0) {
                this.alpha = 0;
                this.canNextStage = true;
            }

            game.ctx.globalAlpha = this.alpha;
        }

        game.drawAndCenterX(game.textGetReady);
        game.drawAndCenterX(game.tapRight);

        game.ctx.globalAlpha = 1.0;

        if (this.canNextStage) game.setStage('play');

    }
}

class StagePlay extends Stage {

    start(game) {
        this.drop = -3;
        this.gameOver = false;
        this.canNextStage = false;
        

        Events.addEventListener(Events.clickOnCanvas, e => {
            if (this.drop <= 2)
                this.drop += 5;
        });

        // Rocks test

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

                game.rocksDown.add()
            }, Random.randomInt(1000, 2000));


        }, 3000);




    }

    draw(game) {

        game.clear();

        game.drawAsBackground(game.background, 1);

        game.drawCollectionGameObject(game.rocks);

        game.drawCollectionGameObject(game.rocksDown);

        game.drawObject(game.planeYellow);

        game.drawAsBackground(game.ground, 4);

        game.rocksDown.objects.forEach(rock => {
            if (game.planeYellow.collision(rock, 15, 15, 100, 0, true, game)) 
                this.gameOver = true;
        });

        game.rocks.objects.forEach(rock => {
            if (game.planeYellow.collision(rock, 15, 15, 100, 0, true, game)) 
                this.gameOver = true;
        });

        if (this.gameOver) {
            game.planeYellow.x -= 4;
            if (game.planeYellow.image.width + game.planeYellow.x < 0)
                this.canNextStage = true;
        } else {
            game.planeYellow.y -= this.drop;
            this.drop -= 0.1;
        }

        if ((game.planeYellow.y + game.planeYellow.image.height) >= (game.height - game.ground.image.height) + 40) {
            this.gameOver = true;
        }

        if (this.canNextStage) {
            clearInterval(this.interval);
            game.rocks.clear();
            game.setStage('gameOver');
        }
        /*ctx.save();
        ctx.translate(objects.planeYellow.x, objects.planeYellow.y);
        ctx.rotate(-10);
        ctx.translate(-objects.planeYellow.x,-objects.planeYellow.y);
        ctx.drawImage(objects.planeYellow.image, objects.planeYellow.x, objects.planeYellow.y);
        ctx.restore();*/

    }

}


class StageGameOver extends Stage {

    start(game) {
        this.nextStage = false;
        this.canNextStage = false;
        this.alpha = 0;
        this.animationEnd = false;
        game.planeYellow.x = game.planeYellow.image.width * -1;
        game.textGameOver.y = 100;

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


        game.drawAndCenterY(game.planeYellow);

        if (this.nextStage) {
            if (this.alpha > 0) this.alpha -= 0.04;

            if (this.alpha < 0) {
                this.alpha = 0;
                this.canNextStage = true;
            }

        }

        game.ctx.globalAlpha = this.alpha;
        game.drawAndCenterX(game.textGameOver);
        game.drawAndCenterX(game.tapRight);
        game.ctx.globalAlpha = 1;

        if (this.canNextStage)
            game.setStage('play');

    }
}


window.onload = () => {
    let game = new TappyPlaneGame();
    game.startGame();
};


