

class TappyPlaneGame extends Game {

    loadAllStages() {
        this.addStage('getReady', new StageGetReady());
        this.addStage('stagePlay', new StagePlay());
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

        let gameObjectTapRight = new StaticGameObject('tapRight', 'tapRight.png');
        this.addGameObject(gameObjectTapRight);

        // Game
        let gameImagesPlaneYellow = ['planeYellow1.png', 'planeYellow2.png', 'planeYellow3.png'];
        let gameObjectPlaneYellow = new AnimatedGameObject('planeYellow', gameImagesPlaneYellow, 2);
        this.addGameObject(gameObjectPlaneYellow);
    }

    startGame(){
        this.loadAllGameObjects();
        this.loadAllStages();
        this.setStage('getReady');
    }

    drawAsBackground(gameObject, velocity){
        
        this.drawObject(gameObject, gameObject.x, this.height - gameObject.image.height);

        this.drawObject(gameObject, gameObject.x + gameObject.image.width, this.height - gameObject.image.height);

        gameObject.x -= velocity;
        if (gameObject.x == gameObject.image.width * -1) gameObject.x = 0;
    }

    drawBackground(){
        this.drawAsBackground(this.background, 1);
        this.drawAsBackground(this.ground, 4);
    }
}


class StageGetReady extends Stage {

    constructor() {
        super()
        this.nextStage = false;
        this.canNextStage = false;
        this.alpha = 1;

        Events.addEventListener(Events.clickOnCanvas, e => {
            this.nextStage = true;
        });
    }

    draw(game) {
        game.clear();
        game.drawBackground();
        game.drawAndCenterY(game.planeYellow, 100);

        if (this.nextStage) {
            if (this.alpha > 0) this.alpha -= 0.04;

            if (this.alpha < 0) {
                this.alpha = 0;
                this.canNextStage = true;
            }

            game.ctx.globalAlpha = this.alpha;
        }

        game.drawAndCenterX(game.textGetReady, 100);
        game.drawAndCenterX(game.tapRight, 300);

        game.ctx.globalAlpha = 1.0;

        if (this.canNextStage) game.setStage('stagePlay');

    }
}

class StagePlay extends Stage {

    constructor() {
        super();
        this.drop = -2;
    }

    start(game) {
        Events.addEventListener(Events.clickOnCanvas, e => {
            if (this.drop < 0) this.drop += 6;
        });
    }

    draw(game) {
        game.clear();
        game.drawBackground();
        game.drawObject(game.planeYellow);
        game.planeYellow.y -= this.drop;
        this.drop -= 0.1;

        /*ctx.save();
        ctx.translate(objects.planeYellow.x, objects.planeYellow.y);
        ctx.rotate(-10);
        ctx.translate(-objects.planeYellow.x,-objects.planeYellow.y);
        ctx.drawImage(objects.planeYellow.image, objects.planeYellow.x, objects.planeYellow.y);
        ctx.restore();*/

    }

}



window.onload = () => {
    let game = new TappyPlaneGame();
    game.startGame();
};
