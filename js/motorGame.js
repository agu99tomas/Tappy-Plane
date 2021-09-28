
// Useful Classes
class Random {
    static randomInt(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

// Game-wide Events and Resources

class Resources {
    static resourcesPath = "./resources/";
    static loadedImages = 0;
    static totalImages = 0;

    static loadImage(imageFileName) {
        Resources.totalImages++;

        let image = new Image();
        image.src = "./resources/" + imageFileName;
        image.onload = e => {
            Resources.loadedImages++;
            Events.dispatchEvent(Events.loadedImage);
        }
        return image;
    }
}

class Events {
    static loadedImage = new Event("loadedImage");
    static clickOnCanvas = new Event("clickOnCanvas");

    static dispatchEvent(eventName) {
        document.dispatchEvent(eventName);
    }

    static addEventListener(event, callable) {
        document.addEventListener(event.type, e => callable(e), false);
    }

}


// Game Objects

class GameObject {

    constructor(id) {
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.image = undefined;
    }
}

class StaticGameObject extends GameObject {

    constructor(id, imageFileName) {
        super(id);
        this.image = Resources.loadImage(imageFileName);
    }
}

class AnimatedGameObject extends GameObject {

    constructor(id, imageFileNames, animationSpeed) {
        super(id);

        this.animationSpeed = animationSpeed;
        this.images = [];

        this.loadImages(imageFileNames);
    }

    loadImages(imageFileNames) {
        self = this;
        imageFileNames.forEach(function (imageFileName, i) {
            let image = Resources.loadImage(imageFileName);
            self.images.push(image);

            if (i == 0) self.image = image;
        });

    }

    animation(currentFrame) {
        if (currentFrame % this.animationSpeed == 1) this.nextImage();
    }

    nextImage() {
        const currentIndex = this.images.indexOf(this.image);
        const nextIndex = (currentIndex + 1) % this.images.length;
        this.image = this.images[nextIndex];
    }
}

// Stage base class

class Stage {

    start(canvas, objects) { } // called in the first frame of stage

    draw(ctx, canvas, frame, objects) { } // called frame by frame

    loading(ctx, canvas, loadedImage, totalImages) { } // called when the game loads
}

// Game Context
class GameContext {

    constructor(game) {
        this.ctx = game.ctx;
        this.canvas = game.canvas;
        this.objects = game.objects;
        this.frame = 0;
    }

    setStage(id) {
        this.game.setStage(id);
    }
}

// Game Class

class Game {

    constructor(firstStage) {
        this.canvas = document.getElementById("canvas");
        this.canvas.width = 800;
        this.canvas.height = 480;
        this.ctx = canvas.getContext("2d");
        this.stage = new Stage();
        this.firstFrame = true;
        this.gameObjects = {};
        this.stages = {};
        this.gameContext = new GameContext(this);

        this.canvas.onclick = e => {
            Events.dispatchEvent(Events.clickOnCanvas);
        }
        Events.addEventListener(Events.loadedImage, e => this.loading());
    }

    addStage(id, stage) {
        this.stages[id] = stage;
    }

    setStage(id) {
        this.stage = this.stages[id];
        this.firstFrame = true;
    }

    addGameObject(gameObject) {
        this.gameObjects[gameObject.id] = gameObject;
    }

    loading() {
        if (Resources.loadedImages == Resources.totalImages)
            this.startLoop();
        else
            this.stage.loading(this.ctx, this.canvas, Resources.loadedImages, Resources.totalImages);
    }

    drawStage(ctx, canvas, frame) {
        if (this.firstFrame) {
            this.stage.start(canvas, this.gameObjects);
            this.firstFrame = false;
        } else {
            this.stage.draw(ctx, canvas, frame, this.gameObjects);
        }
    }

    startLoop() {
        let frame = 1;

        setInterval(() => {
            if (frame == 60) frame = 1;
            this.gameContext.frame = frame;
            this.drawStage(this.ctx, this.canvas, frame);
            frame++;
        }, 16.66666666666667);

    }
}