class Random {
    static randomInt(min, max) {
        // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

class Image2D extends Image {
    static pathToImage = "./resources/";
    static loadedImages = 0;
    static totalImages = 0;

    constructor(imageFileName) {
        super();
        Image2D.totalImages++;

        this.src = Image2D.pathToImage + imageFileName;
        this.onload = e => {
            Image2D.loadedImages++;
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

    draw(ctx) {
        ctx.drawImage(thus.currentImage, this.x, this.y);
        this.playAnimation();
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

    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    draw(baseObject2D) {
        if (typeof baseObject2D === Object2D) {
            baseObject2D.draw(this.ctx);
        }

        if (typeof baseObject2D === CollectionObject2D) {
            baseObject2D.objects.forEach(object2D => {
                object2D.draw(thix.ctx);
            });
        }

    }

}



class Layer {
    loop(canvas) { }
}


class Stage {
    constructor() {
        this.layers = [];
    }

    addLayer(layer) {
        this.layers.push(layer);
    }

    drawAllLayers(canvas) {
        this.layers.forEach(layer => {
            layer.loop(canvas);
        });
    }
}





