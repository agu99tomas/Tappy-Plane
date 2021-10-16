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
        this.animationSpeed = animationSpeed;
    }

    addImage(image2D) {
        this.images.push(image2D);
    }

    playAnimation(frame) {
        if ((frame % this.animationSpeed == 0) && (this.images.length != 1)) {
            this.nextImage();
        }
    }

    hasCollision(){

    }
    
}


class CollectionObject2D extends BaseObject2D{

    constructor(id, object2D) {
        super(id);
        this.object2D = object2D;
        this.objects = [];
    }

    duplicate() {
        let clone = Object.assign({}, this.object2D);
        this.objects.push(clone);
    }

    restore() {
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
