class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.scene.add('Boot', BootScene);
    this.scene.add('Preload', PreloadScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Game', GameScene);
    this.scene.add('UI', UIScene);
    

    this.scene.start('Boot');
  }
}

window.onload = function () {
  window.game = new Game();
}

/*  DO NEXT:

  - buttons you cant afford or click are 'disabled'

  - effects manager class for cool particle emitter and camera effects

  - path manager class

  - upgrades manager class

  - different turret sub classes

  - music manager class with tonejs
  
      =       =
  =       =
    =   =   =  =

      =         =
       =      =
  ====  ====== 

  - options manager class

  - make base and turrets more 'lifelike'. ways:
    - game starts with base 'breathing', enemy paths set up to attack base
    - base grows as you level up
    - turrets must hatch before becoming active, and also 'breathe'

  - different kinds of turret classes, which inheret from turret.
    - they have different images, with different cannons that look like diep.io tanks
    - they have different behaviors and effects

  - highlighter shows range

  - managing and choosing good colors

  - balancing and testing and polishing

  - consider making better images, such as 'armored overlord blip'

  FAR OFF IDEAS / THINGS TO TRY:

  - 3D version of the game
  - add collecting resources 
  - building non-turret defenders
  - multiplayer, send your own blips to attack other player's bases
  - controlled main hero
  - enemies shoot back, fight back in more ways
  - basically turn it more starcraft like, wc3 like, or dota like
    OR more idle like, with more auto-control options

*/