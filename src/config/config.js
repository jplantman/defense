const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 640,
  // pixelArt: true,
  // roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  }
};