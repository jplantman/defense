class Turret extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, 0, 0, 'ball');

    // let sizeVariance = 0.8 + Math.random() * 0.4;

    this.name = 'Blip';
    this.scene = scene;
    this.level = scene.level;
    this.setScale(0.8 / 4)
      .setTint(0xAB41FF)
      .setSize(64*0.8)
      .setInteractive()
      .on('pointerdown', function(pointer){
        let previousSelection = this.scene.selectedStructure
        if (this == previousSelection){
          this.scene.deselectStructure();
          this.scene.showBuyingMenu();
        } 
        else {
          this.scene.selectStructure(this);
        }
      }.bind(this))

    this.highlighterScale = 0.35;

    this.nextTrack = 0;
    this.nextFire = 0;

    this.scene.add.existing(this);
  }

  // nextTrack and nextFire
  update(time, delta) {

    if (time > this.nextTrack){
      this.track(time);
      this.nextTrack = time + 20;
    }
    if (time > this.nextFire) {
      this.fire();
      this.nextFire = time + 50 + 1000 * (100-this.fireRateMod)/100;
    }
  }

  place(i, j) {
    this.y = i * 64 + 32;
    this.x = j * 64 + 32;
    this.level.grid[i][j] = 1;
    this.scene.base.totalTurrets ++;
    this.kills = 0;
    this.damageDealt = 5;
    this.range = 180;
    this.upgradeCount = 0;
    this.fireRateMod = 0;
    this.bulletLifespan = 300;
    this.bulletSpeed = 600;
    this.bulletSizeMod = 0;

    this.id = this.scene.base.totalTurrets;
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