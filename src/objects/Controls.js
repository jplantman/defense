class Controls {
  constructor(scene) {
    this.scene = scene;

    this.createKeyboardControls();
    this.createCursor();

    this.scene.input.on('pointermove', function (pointer) {
      this.pointerMove(pointer)
    }.bind(this))

    this.scene.input.on('pointerdown', this.pointerDown);
    this.scene.input.on('pointerup', this.pointerUp);

    this.scene.cameras.main.zoom = 0.7;
  }

  pointerMove(pointer) {
    var i = Math.floor( (pointer.worldY) / 64); 
    var j = Math.floor( (pointer.worldX) / 64); 

    if (!pointer.isDown && this.scene.canPlaceTurret(i, j)) {
      this.scene.cursor.setPosition(j * 64 + 32, i * 64 + 32)
        .setAlpha(0.3);
    } else {
      this.scene.cursor.setAlpha(0);
    }
    if (pointer.isDown){
      // console.log(pointer)
      let distX = pointer.position.x - pointer.prevPosition.x,
          distY = pointer.position.y - pointer.prevPosition.y;
      this.dragCamera(-distX, -distY)
    }
  }
  pointerDown(pointer) {
    console.log(Math.round(pointer.worldX/100)*100, Math.round(pointer.worldY/100)*100)
  }
  pointerUp(pointer) {
    if(pointer.upTime - pointer.downTime < 150)
    {
      this.scene.placeTurret(pointer);
    }
  }

  createKeyboardControls() {
    this.scene.cursors = this.scene.input.keyboard.createCursorKeys();
    this.scene.wKey = this.scene.input.keyboard.addKey('w');
    this.scene.aKey = this.scene.input.keyboard.addKey('a');
    this.scene.sKey = this.scene.input.keyboard.addKey('s');
    this.scene.dKey = this.scene.input.keyboard.addKey('d');
  }

  updateCamera() {
    // move camera with keyboard
    let camVel = 800;
    if (this.scene.aKey.isDown || this.scene.cursors.left.isDown) {
      this.scene.camSprite.setVelocityX(-camVel);
    }
    else if (this.scene.dKey.isDown || this.scene.cursors.right.isDown) {
      this.scene.camSprite.setVelocityX(camVel);
    }
    else {
      this.scene.camSprite.setVelocityX(0);
    }
    if (this.scene.wKey.isDown || this.scene.cursors.up.isDown) {
      this.scene.camSprite.setVelocityY(-camVel);
    }
    else if (this.scene.sKey.isDown || this.scene.cursors.down.isDown) {
      this.scene.camSprite.setVelocityY(camVel);
    } else {
      this.scene.camSprite.setVelocityY(0);
    }
    // bounds for camera sprite helper
    this.scene.camSprite.x = Math.max(this.scene.camSprite.x, this.scene.cameras.main.width / 2);
    this.scene.camSprite.x = Math.min(this.scene.camSprite.x, this.scene.physics.world.bounds.width - this.scene.cameras.main.width / 2);

    this.scene.camSprite.y = Math.max(this.scene.camSprite.y, this.scene.cameras.main.height / 2);
    this.scene.camSprite.y = Math.min(this.scene.camSprite.y, this.scene.physics.world.bounds.height - this.scene.cameras.main.height / 2);
  }

  dragCamera(x, y) {
    this.scene.camSprite.x += x;
    this.scene.camSprite.y += y;

    // bounds for camera sprite helper
    this.scene.camSprite.x = Math.max(this.scene.camSprite.x, this.scene.cameras.main.width / 2);
    this.scene.camSprite.x = Math.min(this.scene.camSprite.x, this.scene.physics.world.bounds.width - this.scene.cameras.main.width / 2);

    this.scene.camSprite.y = Math.max(this.scene.camSprite.y, this.scene.cameras.main.height / 2);
    this.scene.camSprite.y = Math.min(this.scene.camSprite.y, this.scene.physics.world.bounds.height - this.scene.cameras.main.height / 2);
  }

  createCursor() {
    this.scene.cursor = this.scene.add.image(32, 32, 'ball')
      .setScale(1.3 / 4)
      .setTint(0xAB41FF)
      .setAlpha(0);
  }

  zoomIn() {
    this.scene.cameras.main.zoom = Math.min(1, this.scene.cameras.main.zoom + 0.1);
  }
  zoomOut() {
    this.scene.cameras.main.zoom = Math.max(0.3, this.scene.cameras.main.zoom - 0.1);
  }



}