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
  make ui buttons for choosing upgrade options n such:

  [+] damage
  [+] fire rate
  [+] range
  [+] bullet speed
  [+] bullet lifetime
  [+] bullet size

  base only:
  [+] health
  [+] armor
  [+] recover

  ideas:
  [+] profit multiplier
  [+] shoot more bullets, or other ammo 
  [+] support towers, which help other towers

ALSO DO:

- stats appear as bars, not numbers

- add cool particle emitter and camera effects
 
- minimap?

- enemy spawn manager:
big exciting enemy waves, new enemies, difficulty ramps up in an endless level style
  - example events loop:
    1 some enemies come
    2 a big wave is approaching!
    3 some enemies come
    4 the paths are changing! 
      --(make em procedurally generated or something)
    ...
    a color path is being added!

  - awesome psychadelic music and sounds

  - options to make the game more automatic / idle-y ??
    like 
      -auto upgrade options or something?

  - complete options menu

  FAR OFF IDEAS / THINGS TO TRY:

  - 3D version of the game
  - add collecting resources 
  - building non-turret defenders
  - controlled main hero
  - enemies shoot back, fight back in more ways
  - basically turn it more starcraft like, wc3 like, or dota like

*/