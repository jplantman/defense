class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  // preload() {
  //   console.log('gameScene');
  // }
  init() {
    
    this.level = this.getLevel();
    this.level.grid = [];
    for (let i = 0; i < 10 * this.level.scaleFactor; i++) {
      this.level.grid[i] = [];
      for (let k = 0; k < 10 * this.level.scaleFactor; k++) {
        this.level.grid[i].push(0);
      }
    }
    this.nextEnemy = 1000;
    this.score = 0;

    // world bounds
    let num = 640 * this.level.scaleFactor;
    this.cameras.main.setBounds(0, 0, num, num);
    this.physics.world.setBounds(0, 0, num, num);

    this.events.emit('displayUI');
  }

  create() {
    console.log(this);
  
    this.camSprite = this.physics.add.sprite( 
      this.cameras.main.midPoint.x,
      this.cameras.main.midPoint.y,
      'ball')
      .setSize(this.cameras.main.width, this.cameras.main.height)
      .setVisible(false);
    this.cameras.main.startFollow(this.camSprite)

    this.createPath();
    // this.showClickLocation();
    this.createCursor();
    this.createBase();
    this.createGroups();
    this.setupCollisions();

    this.wKey = this.input.keyboard.addKey('w');
    this.aKey = this.input.keyboard.addKey('a');
    this.sKey = this.input.keyboard.addKey('s');
    this.dKey = this.input.keyboard.addKey('d');
  }

  update(time, delta) {
    this.makeEnemies(time);
    // move camera
    let camVel = 100;
    if ( this.aKey.isDown ){
      this.camSprite.setVelocityX(-camVel);
    } 
    else if (this.dKey.isDown ) {
      this.camSprite.setVelocityX(camVel);
    }
    else {
      this.camSprite.setVelocityX(0);
    }
    if (this.wKey.isDown ) {
      this.camSprite.setVelocityY(-camVel);
    }
    else if (this.sKey.isDown ) {
      this.camSprite.setVelocityY(camVel);
    } else {
      this.camSprite.setVelocityY(0);
    }
    // bounds for camera sprite helper
    this.camSprite.x = Math.max(this.camSprite.x, this.cameras.main.width / 2 );
    this.camSprite.x = Math.min(this.camSprite.x, this.physics.world.bounds.width - this.cameras.main.width / 2);

    this.camSprite.y = Math.max(this.camSprite.y, this.cameras.main.height / 2);
    this.camSprite.y = Math.min(this.camSprite.y, this.physics.world.bounds.height - this.cameras.main.height / 2); 
  }

  createGroups() {
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true
    });
    this.turrets = this.add.group({
      classType: Turret,
      runChildUpdate: true
    });
    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true
    });
  }

  setupCollisions() {
    this.physics.add.overlap(this.base, this.enemies, this.damageBase);
    this.physics.add.overlap(this.bullets, this.enemies, this.damageEnemies.bind(this));
  }

  damageEnemies(bullet, enemy) {
    let cash = enemy.takeDamage( bullet.damageDealt );
    bullet.disable();
    if (cash){
      this.base.cash += 5;
      this.events.emit('updateCash', this.base.cash);
    }
  }

  damageBase(base, enemy) {
    enemy.disable();
      // console.log('boom')
    base.takeDamage(enemy.damageDealt)
  }

  // TODO - add json level loading
  getLevel() {
    return {
      grid: [
        [0, 5, 0, 0, 0, 0, 0, 0, 0, 0], //0    // 5 == start
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0], //1    // 7 == turn
        [0, 1, 0, 7, 1, 1, 1, 1, 7, 0], //2   // 8 == end
        [0, 1, 0, 1, 0, 0, 0, 0, 1, 0], //3
        [0, 1, 0, 1, 0, 0, 0, 0, 1, 0], //4
        [0, 1, 0, 1, 0, 0, 7, 1, 7, 0], //5
        [0, 7, 1, 7, 0, 0, 1, 0, 0, 0], //6
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0], //7
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0], //8
        [0, 0, 0, 0, 0, 0, 8, 0, 0, 0]  //9
      ],//  1  2  3  4  5  6  7  8  9
      points: [
        [1, -1],
        [1, 6],
        [3, 6],
        [3, 2],
        [8, 2],
        [8, 5],
        [6, 5],
        [6, 10]
      ],
      scaleFactor: 4
    };
  }

  createBase() {
    this.base = new Base(this)
  }

  createCursor() {
    this.cursor = this.add.image(32, 32, 'ball')
      .setScale(1.3/4)
      .setTint(0xE8DB3B)  //0x008F02)
      .setAlpha(0);

    this.input.on('pointermove', function (pointer) {
      var i = Math.floor((pointer.y + this.cameras.main.scrollY) / 64); //  - this.cameras.main.x
      var j = Math.floor((pointer.x + this.cameras.main.scrollX) / 64); //  - this.cameras.main.y

      if (this.canPlaceTurret(i, j)) {
        this.cursor.setPosition(j * 64 + 32, i * 64 + 32)
          .setAlpha(0.4);
      } else {
        this.cursor.setAlpha(0);
      }
    }.bind(this))

    this.input.on('pointerdown', this.clickFunc.bind(this))
  }

  clickFunc(pointer) {
    this.placeTurret(pointer);
  }

  placeTurret(pointer) {
    var i = Math.floor((pointer.y + this.cameras.main.scrollY) / 64);
    var j = Math.floor((pointer.x + this.cameras.main.scrollX) / 64);

    if (this.canPlaceTurret(i, j)) {
      var turret = this.turrets.getFirstDead();
      if (!turret) {
        turret = new Turret(this, 0, 0, this.map);
        this.turrets.add(turret);
      }
      turret.setActive(true)
        .setVisible(true);
      turret.place(i, j);
      // TODO - limit number of turrets
    }
  }

  canPlaceTurret(i, j, level) {
    if (!this.level.grid[i]) return;
    return this.level.grid[i][j] == 0;
  }

  createPath() {
    this.graphics = this.add.graphics();
    this.path = this.add.path(
      this.level.points[0][0] * 64 + 32, 
      this.level.points[0][1] * 64 + 32);

    for (let i = 1; i < this.level.points.length; i++) {
      // console.log(i, this.level.points[i])
      this.path.lineTo(
        this.level.points[i][0] * 64 + 32, 
        this.level.points[i][1] * 64 + 32);
    }
    this.graphics.lineStyle(3, 0xFFAE4D, 1);
    this.path.draw(this.graphics);
  
  }

  showClickLocation(){
    this.input.on('pointerdown', function(pointer){
      console.log('X: '+pointer.x);
      console.log('Y: ' + pointer.y);
    });
  }

  getEnemy(x, y, distance) {
    var enemyUnits = this.enemies.getChildren();
    for (var i = 0; i < enemyUnits.length; i++) {
      if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance) {
        return enemyUnits[i];
      }
    }
    return false;
  }

  makeEnemies(time) {
    if (time > this.nextEnemy) {
      var enemy = this.enemies.getFirstDead();
      if (!enemy) {
        enemy = new Enemy(this, 0, 0, this.path);
        this.enemies.add(enemy);
      }

      if (enemy) {
        enemy
          .setActive(true)
          .setVisible(true);

        // place at start of path
        enemy.reenable();

        this.nextEnemy = time + 2000;
      }
    }
  }

  addBullet(x, y, angle) {
    var bullet = this.bullets.getFirstDead();
    if (!bullet) {
      bullet = new Bullet(this, 0, 0);
      this.bullets.add(bullet);
    }
    bullet.fire(x, y, angle);
  }

}