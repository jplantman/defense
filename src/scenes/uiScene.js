
class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UI', active: true });
    this.color = '#AB41FF'; // '#ffffff'
  }

  init() {
    this.gameScene = this.scene.get('Game');
  }

  create() {
    this.setupUIElements();
    this.setupEvents();
  }

  setupUIElements() {
    

    let style = { fontSize: '20px', fill: this.color, fontFamily: 'font1' };

    this.baseText = this.add.text(
      this.gameScene.cameras.main.x + this.gameScene.cameras.main.width - 80, 
      this.gameScene.cameras.main.y + this.gameScene.cameras.main.height - 30, 
      'Base: 100', style)
      .setOrigin(1, 1)
      .setAlpha(0);

    this.expText = this.add.text(
      this.gameScene.cameras.main.x + this.gameScene.cameras.main.width - 80,
      this.gameScene.cameras.main.y + this.gameScene.cameras.main.height - 55, 
      'Exp: 0', style)
      .setOrigin(1, 1)
      .setAlpha(0);
  }

  createPanel() {
    if (!this.panel){
      console.log('tesy')
      this.panel = this.add.image(
        this.gameScene.cameras.main.x,
        this.gameScene.cameras.main.y + this.gameScene.cameras.main.height,
        'brick')
        .setDepth(-1)
        .setScale(10, 4)
        .setScrollFactor(0)
        .setAlpha(0)
        .setInteractive()
        .setOrigin(0, 1);
      
      // zoom buttons
      this.zoomInBtn = this.add.image(
        this.gameScene.cameras.main.x + this.gameScene.cameras.main.width - 10,
        this.gameScene.cameras.main.y + this.gameScene.cameras.main.height - 55 - 20, 
        "brick")
        .setScale(2, 1)
        .setTint(0xAB41FF)
        .setInteractive()
        .on('pointerdown', function () {
          this.controls.zoomIn();
        }.bind(this.gameScene))
      this.zoomInText = this.add.text(
        this.gameScene.cameras.main.x + this.gameScene.cameras.main.width - 37,
        this.gameScene.cameras.main.y + this.gameScene.cameras.main.height - 57 - 20,
        '+', { fontFamily: 'font1', fontSize: '30px', fill: '#fff' }
        ).setOrigin(0.5, 0.5)

      this.zoomOutBtn = this.add.image(
        this.gameScene.cameras.main.x + this.gameScene.cameras.main.width - 10,
        this.gameScene.cameras.main.y + this.gameScene.cameras.main.height - 55 + 30,
        "brick")
        .setScale(2, 1)
        .setTint(0xAB41FF)
        .setInteractive()
        .on('pointerdown', function () {
          this.controls.zoomOut();
        }.bind(this.gameScene))
      this.zoomOutText = this.add.text(
        this.gameScene.cameras.main.x + this.gameScene.cameras.main.width - 37,
        this.gameScene.cameras.main.y + this.gameScene.cameras.main.height - 57 + 30,
        '-', { fontFamily: 'font1', fontSize: '30px', fill: '#fff' }
      ).setOrigin(0.5, 0.5)
        


    }
    this.panel.setAlpha(0.9);
  }

  setupEvents() {
    this.gameScene.events.on('displayUI', function () {
      this.createPanel()
      this.baseText.setAlpha(1);
      this.expText.setAlpha(1);
    }.bind(this));

    this.gameScene.events.on('hideUI', function () {
      this.baseText.setAlpha(0);
      this.expText.setAlpha(0);
      this.panel.setAlpha(0);
    }.bind(this));

    this.gameScene.events.on('updateScore', function (health) {
      this.baseText.setText('Base: ' + health);
    }.bind(this));

    this.gameScene.events.on('updateExp', function (exp) {
      this.expText.setText('Exp: ' + exp);
    }.bind(this));
  }
}