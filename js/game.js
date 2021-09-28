// Globar Game Var
let game;

class StageBackground extends Stage {

    drawRock(ctx, canvas, frame, objects) {
        ctx.drawImage(
            objects.rock.image,
            objects.rock.x + canvas.width,
            canvas.height - objects.rock.image.height,
        );
        objects.rock.x -= 4;


        if (objects.rock.x == (canvas.width * -1) - objects.rock.image.width)
            objects.rock.x = 0;

        // Rock Down
        ctx.drawImage(
            objects.rockDown.image,
            objects.rockDown.x + canvas.width,
            objects.rockDown.y - 100,
        );
        objects.rockDown.x -= 4;

        if (objects.rockDown.x == (canvas.width * -1) - objects.rockDown.image.width)
            objects.rockDown.x = 0;
    }

    drawGround(ctx, canvas, frame, objects) {
        ctx.drawImage(
            objects.ground.image,
            objects.ground.x,
            canvas.height - objects.ground.image.height
        );
        ctx.drawImage(
            objects.ground.image,
            objects.ground.x +
            objects.ground.image.width,
            canvas.height - objects.ground.image.height
        );

        objects.ground.x -= 4;
        if (objects.ground.x == objects.ground.image.width * -1)
            objects.ground.x = 0;
    }

    drawBackground(ctx, canvas, frame, objects) {
        ctx.drawImage(
            objects.background.image,
            objects.background.x,
            objects.background.y
        );
        ctx.drawImage(
            objects.background.image,
            objects.background.x +
            objects.background.image.width,
            objects.background.y
        );

        objects.background.x -= 1;
        if (objects.background.x == objects.background.image.width * -1)
            objects.background.x = 0;
    }

}

class StageGetReady extends Stage {

    constructor() {
        super()
        this.background = new StageBackground();
        this.nextStage = false;
        this.canNextStage = false;
        this.alpha = 1;

        Events.addEventListener(Events.clickOnCanvas, e => {
            this.nextStage = true;
        });
    }

    loading(ctx, canvas, loadedImage, totalImages) { 
        console.log(loadedImage +" "+ totalImages);
    }

    start(canvas, objects) {

        // text ready
        objects.textGetReady.x = (canvas.width / 2) - objects.textGetReady.image.width / 2
        objects.textGetReady.y = 100

        // Tap right
        objects.tapRight.x = (canvas.width / 2) - objects.tapRight.image.width / 2;
        objects.tapRight.y = 300

        // plane
        objects.planeYellow.y = objects.planeYellow.y = (canvas.height / 2) - objects.planeYellow.image.height / 2;;
        objects.planeYellow.x = 100;

    }

    draw(ctx, canvas, frame, objects) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.background.drawBackground(ctx, canvas, frame, objects);
        this.background.drawGround(ctx, canvas, frame, objects);

        ctx.drawImage(objects.planeYellow.image, objects.planeYellow.x, objects.planeYellow.y);
        objects.planeYellow.animation(frame)

        if (this.nextStage) {
            if (this.alpha > 0) this.alpha -= 0.04;

            if (this.alpha < 0) {
                this.alpha = 0;
                this.canNextStage = true;
            }
            ctx.globalAlpha = this.alpha;
        }

        ctx.drawImage(objects.textGetReady.image, objects.textGetReady.x, objects.textGetReady.y);
        ctx.drawImage(objects.tapRight.image, objects.tapRight.x, objects.tapRight.y);
        ctx.globalAlpha = 1.0;

        if (this.canNextStage) game.setStage('stagePlay');

    }

}

class StagePlay extends Stage {

    constructor() {
        super();
        this.background = new StageBackground();
        this.drop = -2;

    }

    start(canvas, objects) {

        Events.addEventListener(Events.clickOnCanvas, e => {
            if (this.drop < 0)
                this.drop += 6;
        });
    }

    draw(ctx, canvas, frame, objects) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.background.drawBackground(ctx, canvas, frame, objects);
        this.background.drawRock(ctx, canvas, frame, objects);
        this.background.drawGround(ctx, canvas, frame, objects);

        ctx.drawImage(objects.planeYellow.image, objects.planeYellow.x, objects.planeYellow.y);
        objects.planeYellow.animation(frame)

        objects.planeYellow.y -= this.drop;
        this.drop -= 0.1;

        /*ctx.save();
        ctx.translate(objects.planeYellow.x, objects.planeYellow.y);
        ctx.rotate(-10);
        ctx.translate(-objects.planeYellow.x,-objects.planeYellow.y);
        ctx.drawImage(objects.planeYellow.image, objects.planeYellow.x, objects.planeYellow.y);
        ctx.restore();*/

    }

}

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
}

window.onload = () => {
    game = new TappyPlaneGame();
    game.startGame();
};
