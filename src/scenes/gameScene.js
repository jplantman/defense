class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  // preload() {
  //   console.log('gameScene');
  // }
  init() {

    this.pathManager = new PathManager(this);

    // this.input.setDefaultCursor('url(assets/ball2.png)');
    
    // this.level = this.getLevel();
    // this.level.grid = [];
    // for (let i = 0; i < 10 * this.level.scaleFactor; i++) {
    //   this.level.grid[i] = [];
    //   for (let k = 0; k < 10 * this.level.scaleFactor; k++) {
    //     // block out middle 4 squares
    //     let midk = (k == 5 * this.level.scaleFactor || k == 5 * this.level.scaleFactor - 1);
    //     let midi = (i == 5 * this.level.scaleFactor || i == 5 * this.level.scaleFactor - 1);
    //     if (midk && midi){
    //       this.level.grid[i].push(1);
    //       // console.log('middle detected at: ', i, k)
    //     } else {
    //       this.level.grid[i].push(0);
    //     }
    //   }
    // }
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

    // this.bg = this.add.graphics()
    //   .fillStyle(0x000000, 1)
    //   .fillRect(0, 0, 640*this.level.scaleFactor, 640*this.level.scaleFactor)
    //   .setDepth(-2)

    this.camSprite = this.physics.add.sprite( 
      this.cameras.main.midPoint.x,
      this.cameras.main.midPoint.y,
      'ball')
      .setSize(this.cameras.main.width, this.cameras.main.height)
      .setVisible(false);
    this.cameras.main.startFollow(this.camSprite);

    // this.createPath();
    this.createBase();
    this.createGroups();
    this.setupCollisions();
    this.controls = new Controls(this);

    this.showBuyingMenu();

    this.turretsAvailable = 0;
    this.events.emit('updateMoney', this.base.money);

    this.spawner = new Spawner(this);
  }

  update(time, delta) {
    // this.makeEnemies(time);
    this.spawner.update(time, delta);
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
      this.base.money += 10;
      this.events.emit('updateExp', this.base.exp);
      this.events.emit('updateMoney', this.base.money);
      bullet.firedBy.kills++;
      if ( bullet.firedBy == this.selectedStructure ){
        this.updateAdditionalDisplay(this.selectedStructure)
      }
    }
  }

  damageBase(base, enemy) {
    enemy.disable();
      // console.log('boom')
    base.takeDamage(enemy.damageDealt)
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



  getEnemy(x, y, distance) {
    var enemyUnits = this.enemies.getChildren();
    for (var i = 0; i < enemyUnits.length; i++) {
      if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance) {
        return enemyUnits[i];
      }
    }
    return false;
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

  updateAdditionalDisplay(structure) {
    this.events.emit(
      'showAdditionalDisplay',
      'Kills: ' + structure.kills + '\n' +
      'Upgrades: ' + structure.upgradeCount + '\n' +
      'Upgrade Cost:\n    ' + (structure.upgradeCount+1)*10
    ); 
  }

  selectStructure(structure) {
    // this.deselectStructure();
    this.events.emit('highlighterSet', structure.x, structure.y, structure.highlighterScale);
    this.events.emit(
      'showNameDisplay', 
      structure.name +' '+ (structure.id || '') + '\n'
    );
    this.updateAdditionalDisplay(structure)
    this.events.emit('showButtons', [
      { text: 'damage: ' + structure.damageDealt,
        func: function () {
          if (this.base.money >= (structure.upgradeCount+1)*10){
            this.base.money -= (structure.upgradeCount+1)*10;
            structure.upgradeCount++;
            structure.damageDealt+=1;
            this.selectStructure(structure);
            this.events.emit('updateMoney', this.base.money);
          }
        }.bind(this)
      },
      {
        text: 'Fire Rate: ' + structure.fireRateMod,
        func: function () {
          if (this.base.money >= (structure.upgradeCount+1)*10){
            this.base.money -= (structure.upgradeCount+1)*10;
            structure.upgradeCount++;
            structure.fireRateMod += 5;
            this.selectStructure(structure);
            this.events.emit('updateMoney', this.base.money);
          }
        }.bind(this)
      },
      {
        text: 'Range: ' + structure.range,
        func: function () {
          if (this.base.money >= (structure.upgradeCount+1)*10){
            this.base.money -= (structure.upgradeCount+1)*10;
            structure.upgradeCount++;
            structure.range += 10;
            this.selectStructure(structure);
            this.events.emit('updateMoney', this.base.money);
          }
        }.bind(this)
      },
      {
        text: 'Bullet Size: ' + structure.bulletSizeMod,
        func: function () {
          if (this.base.money >= (structure.upgradeCount+1)*10){
            this.base.money -= (structure.upgradeCount + 1) * 10;
            structure.upgradeCount++;
            structure.bulletSizeMod += 0.25;
            this.selectStructure(structure);
            this.events.emit('updateMoney', this.base.money);
          }
        }.bind(this)
      },
      {
        text: 'Bullet Speed: ' + structure.bulletSpeed,
        func: function () {
          if (this.base.money >= (structure.upgradeCount+1)*10){
            this.base.money -= (structure.upgradeCount+1)*10;
            structure.upgradeCount++;
            structure.bulletSpeed += 75;
            this.selectStructure(structure);
            this.events.emit('updateMoney', this.base.money);
          }
        }.bind(this)
      },
      {
        text: 'Bullet Lifespan: ' + structure.bulletLifespan,
        func: function () {
          if (this.base.money >= (structure.upgradeCount+1)*10){
            structure.upgradeCount++;
            this.base.money -= (structure.upgradeCount + 1) * 10;
            structure.bulletLifespan += 50;
            this.selectStructure(structure);
            this.events.emit('updateMoney', this.base.money);
          }
        }.bind(this)
      },
    ]);
    structure.isSelected = true;
    this.selectedStructure = structure;
  }

  showBuyingMenu() {
    let cost = 50 + (this.base.totalTurrets+this.turretsAvailable)*10;
    this.events.emit('showButtons', [
      {
        text: 'Buy Blip: $ ' + cost,
        func: function () {
          if (this.base.money >= cost){
            this.base.money -= cost;
            this.events.emit('updateMoney', this.base.money); 
            this.turretsAvailable++;
            this.showBuyingMenu();
          };
        }.bind(this)
      }
    ]);
  }

}