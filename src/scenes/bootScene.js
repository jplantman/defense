class BootScene extends Phaser.Scene {
  constructor(){
    super('Boot');
  }

  preload() {
    console.log('bootScene');
    this.load.image('ball', '../assets/ball2.png');
  }

  create() {
    // TODO - change this back to 'Preload'
    this.scene.start('Game');
  }

}