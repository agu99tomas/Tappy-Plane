

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
        this.addGameObject(gameObjectRock);

        let gameObjectRockDown = new StaticGameObject('rockDown', 'rockGrassDown.png');
        this.addGameObject(gameObjectRockDown);

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
        this.drop = -2;
        this.gameOver = false;
        this.canNextStage = false;

        Events.addEventListener(Events.clickOnCanvas, e => {
            if (this.drop < 0 && !this.gameOver) this.drop += 6;
        });

    }

    draw(game) {
        game.clear();
        game.drawBackground();
        game.drawObject(game.planeYellow);

        if (this.gameOver) {
            game.planeYellow.x-=4;
           if(game.planeYellow.image.width + game.planeYellow.x < 0 )
                this.canNextStage = true;
        }else{
            game.planeYellow.y -= this.drop;
            this.drop -= 0.1;
        }

        if ( (game.planeYellow.y + game.planeYellow.image.height) >=  (game.height - game.ground.image.height ) + 40 ) {
            this.gameOver = true;
        }

        if (this.canNextStage) game.setStage('gameOver');
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


        game.drawAndCenterY(game.planeYellow, 100);

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


