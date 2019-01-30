class Base extends Phaser.GameObjects.Image {
  constructor(scene, x, y){
    super(scene, x, y, 'ball');

    this.name = 'Overlord';
    this.scene = scene;
    this.level = scene.level;
    this.setScale(2/4)
      .setTint(0xAB41FF)
      .setSize(128, 128)
      .setDepth(1)
      .setInteractive()
      .on('pointerdown', function (pointer) {
        let previousSelection = this.scene.selectedStructure
        if (this == previousSelection) {
          this.scene.deselectStructure();
          this.scene.showBuyingMenu();
        }
        else {
          this.scene.selectStructure(this);
        }
      }.bind(this))

    this.highlighterScale = 1;

    this.hp = 100;
    this.exp = 0;
    this.money = 200;
    this.totalTurrets = 0;
    this.nextTrack = 0;
    this.nextFire = 0;
    this.fireRateMod = 0;

    this.kills = 0;
    this.damageDealt = 5;
    this.range = 300;
    this.bulletLifespan = 500;
    this.bulletSpeed = 1000;
    this.upgradeCount = 0;

    this.bulletSizeMod = 2;
    

    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

  }

  update(time, delta) {
    if (time > this.nextTrack) {
      this.track(time);
      this.nextTrack = time + 20;
    }
    if (time > this.nextFire) {
      this.fire();
      this.nextFire = time + 50 + 1000 * (100-this.fireRateMod)/100;
    }
  }

  track(time) {
    var enemy = this.enemyTracking =
      this.scene.getEnemy(this.x, this.y, this.range);
    if (enemy) {
      // enemy.setTint(0x008F02)
      this.trackingAngle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      // this.scene.addBullet(this.x, this.y, angle);
      // this.angle = (this.trackingAngle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
    }
  }

  fire() {
    if (this.enemyTracking) {
      this.scene.addBullet(this);
    }
  }

  takeDamage(amount) { // TODO - check for game over, add explosion
    this.hp -= amount;
    this.scene.events.emit('updateScore', this.hp)
  }

}