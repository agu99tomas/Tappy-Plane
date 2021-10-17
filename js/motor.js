class Random {
  static randomInt(minIncluded, maxIncluded) {
    return Math.floor(
      Math.random() * (maxIncluded - minIncluded + 1) + minIncluded
    );
  }
}

class CustomEvents {
  static loadedImage = new Event("loadedImage");
  static changeStage = new Event("changeStage");

  static dispatchEvent(event, data = undefined) {
    if (data !== undefined) {
      event.data = data;
    }
    document.dispatchEvent(event);
  }

  static addEventListener(event, callable) {
    document.addEventListener(event.type, (e) => callable(e), false);
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
    this.onload = (e) => {
      Image2D.loadedImages++;
      CustomEvents.dispatchEvent(CustomEvents.loadedImage);
    };
  }
}

class Object2D {
  constructor(id, animationSpeed = 2) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.images = [];
    this.currentImage = undefined;
    this.animationSpeed = animationSpeed;
  }

  draw(canvas) {
    canvas.ctx.drawImage(this.currentImage, this.x, this.y);
    this.playAnimation(canvas.frame);
  }

  addImage(imageFileName) {
    let newImage = new Image2D(imageFileName);
    this.images.push(newImage);
    if (this.currentImage === undefined) {
      this.currentImage = newImage;
    }
  }

  playAnimation(frame) {
    if (frame % this.animationSpeed == 0 && this.images.length != 1) {
      this.nextImage();
    }
  }

  nextImage() {
    const currentIndex = this.images.indexOf(this.currentImage);
    const nextIndex = (currentIndex + 1) % this.images.length;
    this.currentImage = this.images[nextIndex];
  }
  
  events(e){

  }

  centerY(canvas) {
    this.y = canvas.height / 2 - this.currentImage.height / 2;
  }

  centerX(canvas) {
    this.x = canvas.width / 2 - this.currentImage.width / 2;
  }

  hasCollision() {}
}

class Collection {
  constructor(id, object) {
    this.id = id;
    this.object = object;
    this.objects = [];
  }

  draw(canvas) {
    this.objects.forEach((obj) => {
      obj.draw(canvas);
    });
  }

  addObject() {
    let clone = Object.assign(this.object);
    this.objects.push(clone);
  }

  clearObjects() {
    this.objects = [];
  }

  remove(gameObject) {
    const index = this.objects.indexOf(gameObject);
    if (index !== -1) {
      this.objects.splice(index, 1);
    }
  }

  removeFromList(objects) {
    objects.forEach((obj) => {
      this.remove(obj);
    });
  }
}

class Canvas {
  constructor(id, width, height) {
    this.realCanvas = document.getElementById(id);
    this.ctx = this.realCanvas.getContext("2d");
    this.realCanvas.width = width;
    this.realCanvas.height = height;
    this.width = this.realCanvas.width;
    this.height = this.realCanvas.height;
    this.frame = 1;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  draw(object) {
    object.draw(this);
  }

  updateFrame() {
    if (this.frame == 60) {
      this.frame = 1;
    } else {
      this.frame++;
    }
  }
}

class Layer {
  start(canvas, objs) {}

  loop(canvas, objs) {}

  events(e) {}

  changeStage(id) {
    CustomEvents.changeStage.data = { id };
    CustomEvents.dispatchEvent(CustomEvents.changeStage);
  }
}

class Background extends Layer {
  constructor(imageFileName, velocity, x = 0, y = 0) {
    super();
    this.image = new Image2D(imageFileName);
    this.velocity = velocity;
    this.x = x;
    this.y = y;
  }

  loop(canvas, objs) {
    canvas.ctx.drawImage(this.image, this.x, canvas.height - this.image.height);
    canvas.ctx.drawImage(
      this.image,
      this.x + this.image.width,
      canvas.height - this.image.height
    );

    this.x -= this.velocity;
    if (this.x == this.image.width * -1) {
      this.x = 0;
    }
  }
}

class Stage {
  constructor(id) {
    this.id = id;
    this.layers = [];
  }

  addLayer(layer) {
    this.layers.push(layer);
  }

  drawLayers(canvas, objs) {
    this.layers.forEach((layer) => {
      layer.loop(canvas, objs);
    });
  }

  notifyLayersEvent(e) {
    this.layers.forEach((layer) => {
      layer.events(e);
    });
  }

  addObjects(objects) {
    this.layers.forEach((layer) => {
      layer.addObjects(objects);
    });
  }

  start(canvas, objs) {
    this.layers.forEach((layer) => {
      layer.start(canvas, objs);
    });
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.stage = undefined;
    this.stages = {};
    this.objects = {};
    this.stageChanged = true;
  }

  addStage(stage) {
    this.stages[stage.id] = stage;
  }

  setStage(id) {
    this.stage = this.stages[id];
    this.stageChanged = true;
  }

  addObject(object) {
    this.objects[object.id] = object;
  }

  start() {
    CustomEvents.addEventListener(CustomEvents.loadedImage, (e) => {
      this.loop();
    });
  }

  loop() {
    if (Image2D.loadedImages == Image2D.totalImages) {
      this.manageEvents();

      const sixtyFPS = 16.66666666666667;
      setInterval(() => {
        if (this.stageChanged) {
          this.stage.start(this.canvas, this.objects);
          this.stageChanged = false;
        }
        this.canvas.clear();
        this.stage.drawLayers(this.canvas, this.objects);
        this.canvas.updateFrame();
      }, sixtyFPS);
    } else {
    }
  }

  manageEvents() {
    this.canvas.realCanvas.addEventListener("click", (e) => {
      this.stage.notifyLayersEvent(e);
      this.notifyObjectsEvent(e);
    });

    document.addEventListener("keydown", (e) => {
      this.stage.notifyLayersEvent(e);
    });

    CustomEvents.addEventListener(CustomEvents.changeStage, (e) => {
      this.setStage(e.data.id);
    });
  }

  notifyObjectsEvent(e){
    let arrayObjects = Object.entries(this.objects);
    arrayObjects.forEach(obj => {
      obj[1].events(e);
    });
  }
}
