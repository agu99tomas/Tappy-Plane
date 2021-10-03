
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

    draw(game) { }

    collision(gameObject, decreaseHorizontal1, decreaseVertical1, decreaseHorizontal2, decreaseVertical2, helper = false, game = undefined) {
        // this
        let x1 = this.x + decreaseHorizontal1 / 2;
        let y1 = this.y + decreaseVertical1 / 2;
        let width1 = this.image.width - decreaseHorizontal1;
        let height1 = this.image.height - decreaseVertical1;
        // GameObject
        let x2 = gameObject.x + decreaseHorizontal2 / 2;
        let y2 = gameObject.y + decreaseVertical2 / 2;
        let width2 = gameObject.image.width - decreaseHorizontal2;
        let height2 = gameObject.image.height - decreaseVertical2;

        if (helper && game !== undefined) {
            // this
            game.ctx.beginPath();
            game.ctx.rect(x1, y1, width1, height1);
            game.ctx.stroke();
            // gameObject
            game.ctx.beginPath();
            game.ctx.rect(x2, y2, width2, height2);
            game.ctx.stroke();
        }


        return (x1 < x2 + width2 &&
            x1 + width1 > x2 &&
            y1 < y2 + height2 &&
            y1 + height1 > y2)
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


class CollectionGameObject {

    constructor(id, baseGameObject) {
        this.id = id;
        this.base = baseGameObject;
        this.objects = [];
    }

    add() {
        let clone = Object.assign({}, this.base);
        this.objects.push(clone);
    }

    clear() {
        this.objects = [];
    }

    remove(gameObject) {
        const index = this.objects.indexOf(gameObject);
        this.objects.splice(index, 1);
    }

    removeAll(gameObjects) {
        gameObjects.forEach(gameObject => {
            this.remove(gameObject);
        });
    }

    draw(game) { }
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
        if (typeof gameObject.draw === "function")
            gameObject.draw(this);

        if (gameObject instanceof AnimatedGameObject) gameObject.animation(this.frame);

        if (x == undefined && y == undefined) {
            this.ctx.drawImage(gameObject.image, gameObject.x, gameObject.y);
        } else {
            if (gameObject.id == 'rock') {
                console.log(gameObject.id == 'rock')
            }
            this.ctx.drawImage(gameObject.image, x || 0, y);
        }
    }

    drawCollectionGameObject(collectionGameObject) {
        collectionGameObject.draw(this);
        collectionGameObject.objects.forEach(gameObject => {
            this.drawObject(gameObject);
        });
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

