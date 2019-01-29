class Enemy extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {


    super(scene, 64 * 6 + 32, 64 * 10, 'ball');
    this.scene = scene;
    this.level = scene.level;
    this
      .setScale(1 / 8)
      // .setTint(pathData.color) // 0xE83C3B
      .setSize(32, 32);

    this.damageDealt = 1;
    this.hp = 0;
    this.expReward = 5;
    this.enemySpeed = 0;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

    // tween fade
    this.tweenFade = this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      ease: 'Power1', // 'Quad.easeInOut',
      duration: 200,
      yoyo: true,
      paused: true
      // onComplete: onCompleteHandler,
      // onCompleteParams: [image]
    });

    this.scene.add.existing(this);


  }

  disable() { // TODO - make this better
    this.x = -10000;
    this.y = -10000;
    this.setActive(false)
      .setVisible(false);
  }

  enable(pathIndex) {
    // reset enemy
    this.pathIndex = pathIndex;
    this.setTint( this.level.paths[pathIndex].color );
    this.path = this.scene.paths[pathIndex];
    this.hp = 80;
    this.enemySpeed = 5 / 100000;
    this.follower.t = 0;

    // get x and y at t == 0
    this.path.getPoint(this.follower.t, this.follower.vec);
    this.setPosition(
      this.follower.vec.x,
      this.follower.vec.y
    );
  }

  update(time, delta) {
    // move t point
    this.follower.t += this.enemySpeed * delta;

    this.path.getPoint(this.follower.t, this.follower.vec);

    // rotate enemy
    if (this.follower.vec.y > this.y) {
      this.angle = 0;
    }
    if (this.follower.vec.x > this.x) {
      this.angle = -90;
    }

    this.setPosition(
      this.follower.vec.x,
      this.follower.vec.y
    );

    if (this.follower.t >= 1) {
      this.setActive(false)
        .setVisible(false);
      // TODO - update player health
    }
  }

  takeDamage(amount) {
    this.alpha = 1;
    this.tweenFade.stop();
    this.tweenFade.restart()
    this.hp -= amount;
    if (this.hp <= 0){
      this.disable();
      return this.expReward;
    } 
  }
}