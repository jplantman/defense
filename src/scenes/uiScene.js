
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

    let style = { fontSize: '18px', fill: '#e4e4e4', fontFamily: 'font1' };

    this.baseText = this.add.text(
      12, 
      12, 
      'Base: 100', style)
      .setOrigin(0, 0)
      .setDepth(1)
      .setAlpha(0);

    this.expText = this.add.text(
      12,
      34, 
      'Exp: 0', style)
      .setOrigin(0, 0)
      .setDepth(1)
      .setAlpha(0);

    this.moneyText = this.add.text(
      12,
      56,
      'Money: $ 100', style)
      .setOrigin(0, 0)
      .setDepth(1)
      .setAlpha(0);
  }

  createPanel() {
    if (!this.panel){
      this.panel = this.add.image(
        this.gameScene.cameras.main.x,
        this.gameScene.cameras.main.y + this.gameScene.cameras.main.height,
        'brick')
        // .setDepth(-1)
        .setScale(10, 4)
        .setScrollFactor(0)
        .setAlpha(-1)
        .setTint(0xE8DB3B)
        .setInteractive()
        .setOrigin(0, 1);
      
      // ui buttons 
      this.createUIButtons();
      this.hideButtons();

      // display name and stuff for selected structure
      this.createNameDisplay();
      this.createAdditionalDisplay();

      // highlighter
      this.highlighter = this.gameScene.add.sprite(
        -600, -600, 'ball')
        .setTint(0xE8DB3B)
        .setAlpha(0.3)
        .setDepth(-1);

      this.highlighter.set = function(x, y, scale){
        this.setVisible(true)
          .setPosition(x, y)
          .setAlpha(0.3)
          .setScale( scale || 1 )
      }
      this.highlighter.hide = function () {
        this
          .setAlpha(0)
          .setVisible(false)
          .setPosition(-600, -600);

      }
    
    }
    this.panel.setAlpha(0.9);
  }

  setupEvents() {
    this.gameScene.events.on('displayUI', function () {
      this.createPanel()
      this.baseText.setAlpha(1);
      this.expText.setAlpha(1);
      this.moneyText.setAlpha(1);
    }.bind(this));

    this.gameScene.events.on('hideUI', function () {
      this.baseText.setAlpha(0);
      this.expText.setAlpha(0);
      this.panel.setAlpha(0);
      this.moneyText.setAlpha(0);
    }.bind(this));

    this.gameScene.events.on('updateScore', function (health) {
      this.baseText.setText('Base: ' + health);
    }.bind(this));

    this.gameScene.events.on('updateExp', function (exp) {
      this.expText.setText('Exp: ' + exp);
    }.bind(this));

    this.gameScene.events.on('updateMoney', function (money) {
      this.moneyText.setText('Money: $ ' + money);
    }.bind(this));

    this.gameScene.events.on('highlighterSet', function (x, y, scale) {
      this.highlighter.set(x, y, scale);
    }.bind(this));

    this.gameScene.events.on('highlighterHide', function () {
      this.highlighter.hide();
    }.bind(this));

    this.gameScene.events.on('showButtons', function (data) {
      this.showButtons(data);
    }.bind(this));

    this.gameScene.events.on('hideButtons', function (data) {
      this.hideButtons(data);
    }.bind(this));

    this.gameScene.events.on('showNameDisplay', function (data) {
      this.showNameDisplay(data);
    }.bind(this));

    this.gameScene.events.on('hideNameDisplay', function (data) {
      this.hideNameDisplay(data);
    }.bind(this));

    this.gameScene.events.on('showAdditionalDisplay', function (data) {
      this.showAdditionalDisplay(data);
    }.bind(this));

    this.gameScene.events.on('hideAdditionalDisplay', function (data) {
      this.hideAdditionalDisplay(data);
    }.bind(this));
  }

  createUIButtons() {
    let style = { fontFamily: 'font1', fontSize: '30px', fill: '#fff' };

    // zoom buttons
    this.zoomInBtn = this.add.image(
      this.gameScene.cameras.main.x + this.gameScene.cameras.main.width - 10 - 30,
      this.gameScene.cameras.main.y + this.gameScene.cameras.main.height - 55 - 20,
      "brick")
      .setScale(1, 1)
      .setTint(0xAB41FF)
      .setInteractive()
      .on('pointerdown', function () {
        this.controls.zoomIn();
      }.bind(this.gameScene))
    .zoomInText = this.add.text(
      this.gameScene.cameras.main.x + this.gameScene.cameras.main.width - 37 - 5,
      this.gameScene.cameras.main.y + this.gameScene.cameras.main.height - 57 - 20,
      '+', style
    ).setOrigin(0.5, 0.5)

    this.zoomOutBtn = this.add.image(
      this.gameScene.cameras.main.x + this.gameScene.cameras.main.width - 10 - 30,
      this.gameScene.cameras.main.y + this.gameScene.cameras.main.height - 55 + 30,
      "brick")
      .setScale(1, 1)
      .setTint(0xAB41FF)
      .setInteractive()
      .on('pointerdown', function () {
        this.controls.zoomOut();
      }.bind(this.gameScene))
    .zoomOutText = this.add.text(
      this.gameScene.cameras.main.x + this.gameScene.cameras.main.width - 37 - 5,
      this.gameScene.cameras.main.y + this.gameScene.cameras.main.height - 57 + 30,
      '-', style
    ).setOrigin(0.5, 0.5);

    // create button sprites from 0 to 9 and use them for any option choosing
    style = { fontFamily: 'font1', fontSize: '16px', fill: '#fff'};
    this.buttons = [];
    let pos = [
      { x: 240, y: this.gameScene.cameras.main.height-110},
      { x: 240, y: this.gameScene.cameras.main.height - 80 },
      { x: 240, y: this.gameScene.cameras.main.height - 50 },
      { x: 240, y: this.gameScene.cameras.main.height - 20 },

      { x: 240+210, y: this.gameScene.cameras.main.height - 110 },
      { x: 240+210, y: this.gameScene.cameras.main.height - 80 },
      { x: 240+210, y: this.gameScene.cameras.main.height - 50 },
      { x: 240+210, y: this.gameScene.cameras.main.height - 20 },
    ];
    for (let i = 0; i < pos.length; i++) {
      this.buttons[i] = this.add.image(
        pos[i].x, pos[i].y, 'brick')
        .setTint(0xAB41FF)
        .setInteractive()
        .setScale(3, 0.7)
        .setScrollFactor(0)
      this.buttons[i].displayText = this.add.text(
        pos[i].x, pos[i].y, 'test', style)
        .setOrigin(0.5, 0.5)
        

    }
  }

  hideButtons() {
    for (let i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];
      button
        .setVisible(false)
        .setActive(false);
      button.displayText.setVisible(false).setActive(false);
      button.off('pointerdown', button.currentFunc)
    }
  }

  showButtons(data) {
    for (let i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];
      // if theres data for this button, set it up
      if ( data[i] ){
        button.off('pointerdown', button.currentFunc)
        button
          .setVisible(true)
          .setActive(true)
        button.currentFunc = data[i].func
        button.on('pointerdown', button.currentFunc)
        button.displayText
          .setVisible(true)
          .setActive(true)
          .setText(data[i].text)
          
      }
      // else if theres NO data for this btton, keep it hidden
      else {
        button.setVisible(false).setActive(false);
        button.off('pointerdown', button.currentFunc)
        button.displayText.setVisible(false).setActive(false);
      }
    }
  }

  // to display the name of selected structure
  createNameDisplay() {
    this.displayName = this.add.text(
      10, 520, 'NAME HERE', { fontFamily: 'font1', fontSize: '20px', fill: '#fff' })
    .setVisible(false)
    .setInteractive()
    .on('pointerdown', function(){
      this.deselectStructure();
      this.showBuyingMenu();
    }.bind(this.gameScene))
  }

  showNameDisplay(text) {
    this.displayName
      .setVisible(true)
      .setText(text);
  }

  hideNameDisplay(text) {
    this.displayName
      .setVisible(false);
  }

  // to display additional info for the selected structure
  createAdditionalDisplay() {
    this.displayAdditional = this.add.text(
      10, 545, '', { fontFamily: 'font1', fontSize: '14px', fill: '#fff' })
      .setVisible(false)
      .setInteractive()
      .on('pointerdown', function () {
        this.deselectStructure();
        this.showBuyingMenu();
      }.bind(this.gameScene))
  }

  showAdditionalDisplay(text) {
    this.displayAdditional
      .setVisible(true)
      .setText(text);
  }

  hideAdditionalDisplay(text) {
    this.displayAdditional
      .setVisible(false);
  }

}