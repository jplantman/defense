
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

    this.baseText = this.add.text(5, 635, 'Base: 100', style)
      .setOrigin(0, 1)
      .setAlpha(0);

    this.ExpText = this.add.text(5, 615, 'Exp: $ 0', style)
      .setOrigin(0, 1)
      .setAlpha(0);
  }

  setupEvents() {
    this.gameScene.events.on('displayUI', function () {
      this.baseText.setAlpha(1);
      this.ExpText.setAlpha(1);
    }.bind(this));

    this.gameScene.events.on('hideUI', function () {
      this.baseText.setAlpha(0);
      this.ExpText.setAlpha(1);
    }.bind(this));

    this.gameScene.events.on('updateScore', function (health) {
      this.baseText.setText('Base: ' + health);
    }.bind(this));

    this.gameScene.events.on('updateExp', function (exp) {
      this.ExpText.setText('Exp: ' + exp);
    }.bind(this));
  }
}