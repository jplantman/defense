class BootScene extends Phaser.Scene {
  constructor(){
    super('Boot');
  }

  preload() {
    console.log('bootScene');
    this.load.image('ball', '../assets/ball2.png');
  }

  create() {
    this.scene.start('Preload');
  }

}