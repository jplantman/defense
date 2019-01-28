class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  init() {
    console.log('preloadScene');
    this.readyCount = 0;
  }

  preload() {
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    // add logo img
    this.add.image(width / 2, height / 2 - 100, 'ball')
      .setScale(0.25);

    this.createPreloader(width, height)

    // time event for logo
    // TODO - update delayed call time to 3000
    this.timedEvent = this.time.delayedCall(3, this.ready, [], this);

    this.loadAssets();
  }

  createPreloader(width, height) {
    // display progress bar
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);

    // loading text
    let loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 55,
      text: 'Loading',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    })
      .setOrigin(0.5);

    // percent text
    let percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    })
      .setOrigin(0.5);

    // loading assets text
    let assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    })
      .setOrigin(0.5);

    // update progress bar
    this.load.on('progress', function (val) {
      percentText.setText(parseInt(val * 100) + '%');
      progressBar.clear();
      progressBox.fillStyle(0x444444, 0.8);
      progressBox.fillRect(width / 2 - 150, height / 2 - 20, 300 * val, 30);
    });

    // update asset text
    this.load.on('fileprogress', function (file) {
      assetText.setText('loading ' + file.key);
    });

    // remove bar when complete
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      assetText.destroy();
      percentText.destroy();
      loadingText.destroy();

      this.ready();
    }.bind(this));
  }

  loadAssets() {
    // images

    this.load.image('brick', '../assets/brick-grad.png')
    // for (let i = 0; i < 200; i++) {
    //   this.load.image('ball'+i, '../assets/ball.png');
    // }

    // tile map
    // this.load.tilemapTiledJSON('level1', 'assets/level/level1.json')
    // this.load.spritesheet(
    //   'terrainTiles_default',
    //   'assets/level/terrainTiles_default.png',
    //   {
    //     frameWidth: 64,
    //     frameHeight: 64
    //   })
  }

  ready() {
    this.readyCount++;
    if (this.readyCount == 2) {
      // TODO - switch to Title screen
      this.scene.start('Title');
    }
  }

}