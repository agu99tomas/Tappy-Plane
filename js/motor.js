class Random {
    static randomInt(min, max) {
        // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
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

class Image2D extends Image {
    static pathToImage = "./images/";
    static loadedImages = 0;
    static totalImages = 0;

    constructor(imageFileName) {
        super();
        Image2D.totalImages++;

        this.src = Image2D.pathToImage + imageFileName;
        this.onload = e => {
            Image2D.loadedImages++;
            Events.dispatchEvent(Events.loadedImage);
        }
    }
}

class BaseObject2D {
    constructor(id) {
        this.id = id;
    }
}

class Object2D extends BaseObject2D {
    constructor(id, animationSpeed = 2) {
        super(id);
        this.x = 0;
        this.y = 0;
        this.images = [];
        this.currentImage = undefined;
        this.animationSpeed = animationSpeed;
    }

    draw(canvas) {
        canvas.ctx.drawImage(thus.currentImage, this.x, this.y);
        this.playAnimation(canvas.frame);
    }

    addImage(image2D) {
        this.images.push(image2D);
        this.currentImage = this.images[0];
    }

    playAnimation(frame) {
        if ((frame % this.animationSpeed == 0) && (this.images.length != 1)) {
            this.nextImage();
        }
    }

    nextImage() {
        const currentIndex = this.images.indexOf(this.currentImage);
        const nextIndex = (currentIndex + 1) % this.images.length;
        this.currentImage = this.images[nextIndex];
    }

    hasCollision() {

    }

}

class CollectionObject2D extends BaseObject2D {

    constructor(id, object2D = undefined) {
        super(id);
        this.object2D = object2D;
        this.objects = [];
    }

    drawAllObjects2D(canvas) {
        this.objects.forEach(object2D => {
            object2D.draw(canvas);
        });
    }

    duplicate() {
        let clone = Object.assign({}, this.object2D);
        this.objects.push(clone);
    }

    addObject2D(object2D) {
        this.objects.push(object2D);
    }

    restoreObjects() {
        this.objects = [];
    }

    remove(gameObject) {
        const index = this.objects.indexOf(gameObject);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }

    removeFromList(gameObjects) {
        gameObjects.forEach(gameObject => {
            this.remove(gameObject);
        });
    }

}

class Canvas {

    constructor(id, width, height) {
        this.realCanvas = document.getElementById(id);
        this.ctx = realCanvas.getContext("2d");
        this.realCanvas.width = width;
        this.realCanvas.height = height;
        this.width = this.realCanvas.width;
        this.height = this.realCanvas.height;
        this.frame = 1;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    draw(baseObject2D) {
        if (typeof baseObject2D === Object2D) {
            baseObject2D.draw(this);
        }

        if (typeof baseObject2D === CollectionObject2D) {
            baseObject2D.drawAllObjects2D(this);
        }
    }

    updateFrame() {
        if (this.frame == 61) {
            this.frame = 1;
        } else {
            this.frame++;
        }
    }

}

class Layer {
    loop(canvas) { }
    events(e) { }
}


class Stage {
    constructor(id) {
        this.id = id;
        this.layers = [];
    }

    addLayer(layer) {
        this.layers.push(layer);
    }

    drawLayers(canvas) {
        this.layers.forEach(layer => {
            layer.loop(canvas);
        });
    }

    notifyLayersEvent(e){

    }
}

class Game {

    constructor(canvas) {
        this.canvas = canvas;
        this.stage = undefined;
        this.stages = {};
    }

    addStage(stage) {
        this.stages[stage.id] = stage;
    }

    setStage(id) {
        this.stage = this.stages[id];
    }

    addGameObject(gameObject) {
        Object.defineProperty(this, gameObject.id, {
            value: gameObject
        });
    }

    loop() {
        const sixtyFPS = 16.66666666666667;
        setInterval(() => {
            this.stage.drawLayers(this.canvas);
            this.canvas.updateFrame();
        }, sixtyFPS);
    }

    manageEvents() {
        this.canvas.realCanvas.onclick = e => { Events.dispatchEvent(Events.clickOnCanvas) };
        Events.addEventListener(Events.loadedImage, e => this.loading());

        Events.addEventListener(Events.clickOnCanvas, e => {
            this.stage.notifyLayersEvent(e);
        });
    }

}