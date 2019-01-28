class Base extends Phaser.GameObjects.Image {
  constructor(scene, x, y){
    super(scene, x, y, 'ball');

    this.scene = scene;
    this.level = scene.level;
    this.setScale(2/4)
      .setTint(0xAB41FF)
      .setSize(128, 128)
      .setDepth(1);

    this.hp = 100;
    this.exp = 0;
    this.totalTurrets = 0;

    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

  }

  takeDamage(amount) { // TODO - check for game over, add explosion
    this.hp -= amount;
    this.scene.events.emit('updateScore', this.hp)
  }
}