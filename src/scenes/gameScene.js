class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  // preload() {
  //   console.log('gameScene');
  // }
  init() {

    // this.input.setDefaultCursor('url(assets/ball2.png)');
    
    this.level = this.getLevel();
    this.level.grid = [];
    for (let i = 0; i < 10 * this.level.scaleFactor; i++) {
      this.level.grid[i] = [];
      for (let k = 0; k < 10 * this.level.scaleFactor; k++) {
        // block out middle 4 squares
        let midk = (k == 5 * this.level.scaleFactor || k == 5 * this.level.scaleFactor - 1);
        let midi = (i == 5 * this.level.scaleFactor || i == 5 * this.level.scaleFactor - 1);
        if (midk && midi){
          this.level.grid[i].push(1);
          // console.log('middle detected at: ', i, k)
        } else {
          this.level.grid[i].push(0);
        }
      }
    }
    this.nextEnemy = 1000;
    this.score = 0;
    this.selectedStructure = null;

    // world bounds
    let num = 640 * this.level.scaleFactor;
    this.cameras.main.setBounds(0, 0, num, num);
    this.physics.world.setBounds(0, 0, num, num);

    this.events.emit('displayUI');
  }

  create() {
    console.log(this);

    this.bg = this.add.graphics()
      .fillStyle(0x000000, 1)
      .fillRect(0, 0, 640*this.level.scaleFactor, 640*this.level.scaleFactor)
      .setInteractive()
      .setDepth(-2)
      .on('pointerdown', function(pointer){
        console.log('test')
      })

    this.camSprite = this.physics.add.sprite( 
      this.cameras.main.midPoint.x,
      this.cameras.main.midPoint.y,
      'ball')
      .setSize(this.cameras.main.width, this.cameras.main.height)
      .setVisible(false);
    this.cameras.main.startFollow(this.camSprite);

    this.createPath();
    this.createBase();
    this.createGroups();
    this.setupCollisions();
    this.controls = new Controls(this);

    this.showBuyingMenu();

    this.turretsAvailable = 0;
    this.events.emit('updateMoney', this.base.money);
  }

  update(time, delta) {
    this.makeEnemies(time);
    this.controls.updateCamera();
    this.base.update(time, delta);
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
    let exp = enemy.takeDamage( bullet.damageDealt );
    bullet.disable();
    if (exp){
      this.base.exp += 5;
      this.base.money += 1;
      this.events.emit('updateExp', this.base.exp);
      this.events.emit('updateMoney', this.base.money);
      bullet.firedBy.kills++;
      // console.log('turret id : kills', bullet.firedBy.id, bullet.firedBy.kills )
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
      paths: [
        {
          color: "0xFFAE4D", // orange
          points: [
            [800, -64],
            [600, 1000],
            [1000, 600],
            [700, 1300],
            [1300, 1000],
            [1280, 1280]
          ]
        },
        {
          color: "0xE83C3B", // red
          points: [
            [2600, 2100],
            [2300, 1800],
            [1900, 2100],
            // [1800, 2000],
            [1750, 1900],
            [2000, 1500],
            [1700, 1300],
            [1500, 1300],
            [1500, 1500],
            [1400, 1500],
            [1280, 1280]
          ]
        },
        {
          color: "0x008F02", // green
          points: [
            [-100, 1900],
            [300, 1800],
            [300, 1400],
            [500, 1500],
            [600, 1300],
            [800, 1700],
            [1100, 1500],
            [1100, 1300],
            [1280, 1280]
          ]
        },
        {
          color:  "0xE8DB3B", // yellow
          points: [
            [2600, 200],
            [2400, 400],
            [2100, 300],
            [2100, 800],
            [1800, 700],
            [1900, 1000],
            [1600, 1000],
            [1600, 1100],
            [1600, 1100],
            [1400, 1100],
            [1400, 1300],
            [1280, 1280]
          ]
        }
      ],
      scaleFactor: 4
    };
  }

  createBase() {
    this.base = new Base(
      this, 
      this.level.scaleFactor * 320, 
      this.level.scaleFactor * 320);

    this.camSprite.x = this.base.x;
    this.camSprite.y = this.base.y;
  }

  placeTurret(pointer, i, j) {
    this.deselectStructure();
    var turret = this.turrets.getFirstDead();
    if (!turret) {
      turret = new Turret(this, 0, 0, this.map);
      this.turrets.add(turret);
    }
    turret.setActive(true)
      .setVisible(true)
      .place(i, j);
    this.selectStructure(turret);
  }

  canPlaceTurret(i, j, level) {
    if (!this.level.grid[i]) return;
    return this.level.grid[i][j] == 0;
  }

  createPath() {
    this.paths = [];
    for (let k = 0; k < this.level.paths.length; k++) {
      const pathData = this.level.paths[k];
      let graphic = this.add.graphics();
      this.paths[k] = this.add.path(
        pathData.points[0][0],
        pathData.points[0][1]);

      for (let i = 1; i < pathData.points.length; i++) {
        // console.log(i, this.level.points[i])
        this.paths[k].lineTo(
          pathData.points[i][0],
          pathData.points[i][1]);
      }
      graphic.lineStyle(3, pathData.color, 1); // 0xFFAE4D
      this.paths[k].draw(graphic);
    }

    
  
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
        
        enemy = new Enemy(this, 0, 0);
        this.enemies.add(enemy);
      }

      if (enemy) {
        enemy
          .setActive(true)
          .setVisible(true);

        // place at start of path
        let pathIndex = Math.floor(Math.random() * this.level.paths.length);
        enemy.enable(pathIndex);

        this.nextEnemy = time + 2000;
      }
    }
  }

  addBullet(firedBy) {
    let bullet = this.bullets.getFirstDead();
    if (!bullet) {
      bullet = new Bullet(this, 0, 0);
      this.bullets.add(bullet);
    }
    bullet.fire(firedBy);
  }

  deselectStructure() {
    if (this.selectedStructure) {
      this.selectedStructure
        .isSelected = false;
      this.events.emit('highlighterHide');
      this.events.emit('hideNameDisplay');
      this.events.emit('hideAdditionalDisplay'); 
      this.events.emit('hideButtons');
    };
    this.selectedStructure = null;
  }

  selectStructure(structure) {
    // this.deselectStructure();
    this.events.emit('highlighterSet', structure.x, structure.y, structure.highlighterScale);
    this.events.emit(
      'showNameDisplay', 
      structure.name +' '+ (structure.id || '') + '\n'
    );
    this.events.emit(
      'showAdditionalDisplay',
      'Kills: ' + structure.kills + '\n' +
      'Upgrades: ' + structure.upgradeCount + '\n' +
      'Upgrade Cost: '
    ); 
    this.events.emit('showButtons', [
      { text: 'damage: ' + structure.damageDealt,
        func: function(){
          structure.upgradeCount++;
          structure.damageDealt+=2;
          this.selectStructure(structure);
        }.bind(this)
      },
      {
        text: 'Fire Rate: ' + structure.fireRateMod,
        func: function () {
          structure.upgradeCount++;
          structure.fireRateMod += 5;
          this.selectStructure(structure);
        }.bind(this)
      },
      {
        text: 'Range: ' + structure.range,
        func: function () {
          structure.upgradeCount++;
          structure.range += 10;
          this.selectStructure(structure);
        }.bind(this)
      },
      {
        text: 'Bullet Size: ' + structure.bulletSizeMod,
        func: function () {
          structure.upgradeCount++;
          structure.bulletSizeMod += 0.25;
          this.selectStructure(structure);
        }.bind(this)
      },
      {
        text: 'Bullet Speed: ' + structure.bulletSpeed,
        func: function () {
          structure.upgradeCount++;
          structure.bulletSpeed += 75;
          this.selectStructure(structure);
        }.bind(this)
      },
      {
        text: 'Bullet Lifespan: ' + structure.bulletLifespan,
        func: function () {
          structure.upgradeCount++;
          structure.bulletLifespan += 50;
          this.selectStructure(structure);
        }.bind(this)
      },
    ]);
    structure.isSelected = true;
    this.selectedStructure = structure;
  }

  showBuyingMenu() {
    this.events.emit('showButtons', [
      {
        text: 'Buy Blip: $50',
        func: function () {
          if (this.base.money >= 50){
            this.base.money -= 50;
            this.events.emit('updateMoney', this.base.money); 
            this.turretsAvailable++ 
          };
        }.bind(this)
      }
    ]);
  }

}