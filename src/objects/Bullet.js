class Bullet extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'ball');

    this.scene = scene;
    this.dx = 0;
    this.dy = 0;
    this.lifespan = 0;
    this.speed = 800;
    this.damageDealt = 5;
    this.setScale(1 / 16)
      .setTint(0xAB41FF)
      .setSize(16, 16)

    // add the bullet to game
    this.scene.add.existing(this);
  }

  update(time, detla) {
    this.lifespan -= detla;
    // console.log(Math.abs(this.dx) + Math.abs(this.dy));
    this.x += this.dx * this.speed * detla / 1000;
    this.y += this.dy * this.speed * detla / 1000;

    if (this.lifespan <= 0) {
      this.setActive(false)
        .setVisible(false);
    }
  }

  fire(firedBy) {
    this.firedBy = firedBy;
    let x = firedBy.x,
      y = firedBy.y,
      angle = firedBy.trackingAngle;
    this.setActive(true)
      .setVisible(true);

    // update pos of bulllet
    this.setPosition(x, y);
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);

    this.lifespan = 300;
  }

  disable() { // TODO - make this better
    this.x = -11000;
    this.y = -11000;
    this.setActive(false)
      .setVisible(false);
  }
}