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

  - make multiple different colored teams, with a path for each
    - paths can be angled, build even on path, 
    - paths procedurally generated, and can change during the game

  - zoom up and down with keyboard or mousewheel

  - drag world to move cam
  
  - select system for base and turrets
    - system to upgrade base turrets
    - base shoots, heals over time, has armor, etc. hivemind style
    - minimap

  - make a ui panel, where turrets can be bought

  - big exciting enemy waves, new enemies, difficulty ramps up in an endless level style
    - example events loop:
      1 some enemies come
      2 a big wave is approaching!
      3 some enemies come
      4 the paths are changing! 
      ...
      a color path is being added!


  FAR OFF IDEAS:

  - 3D camera view
  - add collecting resources 
  - building non-turret defenders
  - controlled main hero
  - hotkeys
  - enemies shoot back, fight back in more ways

*/