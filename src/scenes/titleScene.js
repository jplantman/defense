class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title')
  }

  create() {
    console.log('titleScene');
    // title iamge
    this.createTitle();

    // play button
    this.createPlayButton();
  }

  createTitle(){
    this.titleText = this.add.text(0, 0, 'Defense', 
      {font: '40px monospace', fill: '#eeeeee' })
      .setOrigin(0.5, 0.5);
      this.centerObject(this.titleText, 1);

      // Graphic Path / Line
      this.graphics = this.add.graphics();
      this.path = this.add.path(0, 220);
      this.path.lineTo(220, 200);
      this.path.lineTo(200, 260);
    this.path.lineTo(640, 240);
      this.graphics.lineStyle(3, 0xffffff, 1);
      this.path.draw(this.graphics);
  }

  createPlayButton(){
    this.gameButton = this.add.sprite(0, 0, 'ball')
      .setInteractive()
      .setScale(2.5/4)
      .setTint(0x008F02);
    this.centerObject(this.gameButton, -1);

    this.gameText = this.add.text(0, 0, 'Play', {
      fontSize: '32px',
      fill: '#ffffff'
    })
    Phaser.Display.Align.In.Center(
      this.gameText,
      this.gameButton
    )

    this.gameButton.on('pointerdown', function () {
      this.scene.start('Game');
    }.bind(this));

    // this.gameButton.on('pointerover', function () {
    //   this.gameButton.setTexture('blueButton2');
    // }.bind(this));

    // this.gameButton.on('pointerout', function () {
    //   this.gameButton.setTexture('blueButton1');
    // }.bind(this));
  }

  centerObject( gameObject, offset = 0 ){
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    gameObject.x = width / 2;
    gameObject.y = height / 2 - offset * 100;
  }
}