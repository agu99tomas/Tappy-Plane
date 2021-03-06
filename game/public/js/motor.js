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

  constructor(imageFileName, id = undefined) {
    super();
    Image2D.totalImages++;
    this.id = id;

    this.src = Image2D.pathToImage + imageFileName;
    this.onload = (e) => {
      Image2D.loadedImages++;
      CustomEvents.dispatchEvent(CustomEvents.loadedImage);
    };
  }
}

class Box {
  constructor() {
    this.width = 0;
    this.height = 0;
  }
}

class Object2D {
  constructor(id, animationSpeed = 2) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.box = new Box();
    this.images = [];
    this.currentImage = undefined;
    this.animationSpeed = animationSpeed;
    this.visible = true;
  }

  draw(canvas) {
    canvas.ctx.drawImage(this.currentImage, this.x, this.y);
    this.playAnimation(canvas.frame);
  }

  updateSizes() {
    this.height = this.currentImage.height;
    this.width = this.currentImage.width;
    this.box.width = this.width;
    this.box.height = this.height;
  }

  addImage(fileName) {
    let newImage = new Image2D(fileName);
    this.images.push(newImage);
    if (this.currentImage === undefined) {
      this.currentImage = newImage;
      this.currentImage.addEventListener("load", (e) => {
        this.updateSizes();
      });
    }
  }

  addImages(...fileNames) {
    fileNames.forEach((fileName) => {
      this.addImage(fileName);
    });
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
    this.updateSizes();
  }

  events(e) {}

  centerY(canvas) {
    this.y = canvas.height / 2 - this.height / 2;
  }

  centerX(canvas) {
    this.x = canvas.width / 2 - this.width / 2;
  }

  clicked(x2, y2) {
    let increase = 70;
    let height = this.height + increase;
    let width = this.width + increase;
    let x = this.x - increase/2;
    let y = this.y - increase/2;

    if (
      y2 > y &&
      y2 < y + height &&
      x2 > x &&
      x2 < x + width
    ) {
      return true;
    }
    return false;
  }

  centerBoxAxis(object2D) {
    // no se deberia necesitar pasar object2d como parametro
    this.box.y = this.y + (this.height / 2) - (this.box.height / 2) ;
    this.box.x = this.x + (this.width / 2) - (this.box.width / 2);

    object2D.box.y = object2D.y + (object2D.height / 2) - (object2D.box.height /2);
    object2D.box.x = object2D.x + (object2D.width / 2) - (object2D.box.width /2);
  }

  drawHelperCollision(canvas, object2D) {
    // no se deberia necesitar pasar object2d como parametro
    canvas.drawRect(this.box.x, this.box.y, this.box.width, this.box.height);
    canvas.drawRect(object2D.box.x, object2D.box.y, object2D.box.width, object2D.box.height);
  }

  hasCollision(object2D, canvas = undefined, helper = false) {
    this.centerBoxAxis(object2D);
    if (helper) {
      this.drawHelperCollision(canvas, object2D);
    }
    
    return (this.box.x < object2D.box.x + object2D.box.width &&
      this.box.x + this.box.width > object2D.box.x &&
      this.box.y < object2D.box.y + object2D.box.height &&
      this.box.y + this.box.height > object2D.box.y);
      
  }
}

class CollectionImage {
  constructor(id) {
    this.id = id;
    this.images = [];
  }

  draw(canvas) {}

  addImage(fileName) {
    let newImage = new Image2D(fileName);
    this.images.push(newImage);
  }

  addImages(...fileNames) {
    fileNames.forEach((fileName) => {
      this.addImage(fileName);
    });
  }

  events(e) {}
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

  drawImage(image, x, y) {
    this.ctx.drawImage(image, x, y);
  }

  drawRect(x, y, width, height) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.ctx.stroke();
  }

  getCursorPosition(event) {
    const rect = this.realCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
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

  events(e, canvas, objects) {}

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

  notifyLayersEvent(e, canvas, objects) {
    this.layers.forEach((layer) => {
      layer.events(e, canvas, objects);
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
    this.stageChanged = false;
  }

  addStage(stage) {
    this.stages[stage.id] = stage;
    if (this.stage === undefined) {
      this.setStage(stage.id);
    }
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
      this.stage.notifyLayersEvent(e, this.canvas, this.objects);
      this.notifyObjectsEvent(e);
    });

    document.addEventListener("keydown", (e) => {
      this.stage.notifyLayersEvent(e, this.canvas, this.objects);
    });

    CustomEvents.addEventListener(CustomEvents.changeStage, (e) => {
      this.setStage(e.data.id);
    });
  }

  notifyObjectsEvent(e) {
    let arrayObjects = Object.entries(this.objects);
    arrayObjects.forEach((obj) => {
      obj[1].events(e);
    });
  }
}
