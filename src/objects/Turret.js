class Turret extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, 0, 0, 'ball');

    let sizeVariance = 1; //0.8 + Math.random() * 0.4;

    this.scene = scene;
    this.level = scene.level;
    this.setScale(0.8 / 4 * sizeVariance)
      .setTint(0xAB41FF)
      .setSize(64*0.8 * sizeVariance)

    this.scene.add.existing(this);

    this.range = 180;

    this.nextTrack = 0;
    this.nextFire = 0;
  }

  update(time, delta) {
    if (time > this.nextTrack){
      this.track(time);
      this.nextTrack = time + 20;
    }
    if (time > this.nextFire) {
      this.fire();
      this.nextFire = time + 500;
    }
  }

  place(i, j) {
    this.y = i * 64 + 32;
    this.x = j * 64 + 32;
    this.level.grid[i][j] = 1;
    this.scene.base.totalTurrets ++;
    this.kills = 0;
    this.id = 'T'+Date.now();
  }

  track(time) {
    var enemy = this.enemyTracking = 
      this.scene.getEnemy(this.x, this.y, this.range);
    if (enemy) {
      // enemy.setTint(0x008F02)
      this.trackingAngle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      // this.scene.addBullet(this.x, this.y, angle);
      this.angle = (this.trackingAngle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
    }
  }

  fire() {
    if (this.enemyTracking){
      this.scene.addBullet(this);
    }
  }

}