
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

    start(game) { } // called on change of stage

    draw(game) { } // called frame by frame

    loading(game) { } // called when the game loads
}

// Game Class

class Game {

    constructor(firstStage) {
        // Canvas
        this.canvas = document.getElementById("canvas");
        this.canvas.width = 800;
        this.canvas.height = 480;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx = canvas.getContext("2d");

        // Stage
        this.stage = new Stage();
        this.firstFrame = true;
        this.stages = {};
        this.frame = 1;

        // Events
        this.canvas.onclick = e => { Events.dispatchEvent(Events.clickOnCanvas) };
        Events.addEventListener(Events.loadedImage, e => this.loading());
    }

    addStage(id, stage) {
        this.stages[id] = stage;
    }

    setStage(id) {
        this.stage = this.stages[id];
        this.firstFrame = true;
        this.stage.start(this);
    }

    addGameObject(gameObject) {
        Object.defineProperty(this, gameObject.id, {
            value: gameObject
        });
    }

    loading() {
        if (Resources.loadedImages == Resources.totalImages)
            this.startLoop();
        else
            this.stage.loading(this);
    }

    startLoop() {
        setInterval(() => {
            if (this.frame == 60) this.frame = 1;
            this.stage.draw(this);
            this.frame++;
        }, 16.66666666666667);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawObject(gameObject, x, y) {
        if (gameObject instanceof AnimatedGameObject) gameObject.animation(this.frame);
        if (x == undefined && y == undefined) {
            this.ctx.drawImage(gameObject.image, gameObject.x, gameObject.y);
        } else {
            this.ctx.drawImage(gameObject.image, x || 0, y);
        }
    }

    drawAndCenterY(gameObject) {
        gameObject.y = (this.height / 2) - gameObject.image.height / 2;
        this.drawObject(gameObject);
    }

    drawAndCenterX(gameObject) {
        gameObject.x = (this.width / 2) - gameObject.image.width / 2;
        this.drawObject(gameObject);
    }
}

