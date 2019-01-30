class Spawner {
  constructor(scene) {
    this.scene = scene;
    this.nextPowerUp = 2 * 60000; // 60000 == a min

    this.nextEnemy = 0;
    this.nextDelay = 1500;
    this.enemyHP = 10;
    this.enemySpeed = 4;

    this.nextHugeWave = 1.5 * 60000;
    this.hugeWaveOverTime = 0;
  }

  update(time, delta){
    if (time > this.nextEnemy) {
      // console.log('spawning enemy, next in: ' + this.nextDelay*(time < this.hugeWaveOverTime ? 0.3 : 1))
      this.makeEnemy(time);
    }
    // power up
    if (this.nextPowerUp <= time){
      this.nextPowerUp += 2 * 60000;

      this.nextDelay *= 0.97;
      this.enemyHP = Math.round(( this.enemyHP + 5 ) * 1.2);
      this.enemySpeed += 0.5;
      console.log('Enemies are getting stronger!');
      // make the receiver for this line:
      this.scene.events.emit('announcement', 'Enemies are getting stronger!'); 
    }
    // huge wave
    if (this.nextHugeWave <= time){
      this.nextHugeWave += (1.25 + Math.random()*1.25) * 60000;
      this.hugeWaveOverTime = time + 0.5 * 60000;
      console.log('A huge wave is approaching!');
      // make the receiver for this line:
      this.scene.events.emit('announcement', 'A huge wave of enemies is approaching!'); 
    }

  }

  makeEnemy(time) {
    let enemyData = {
      hp: this.enemyHP,
      speed: this.enemySpeed
    }
    
    var enemy = this.scene.enemies.getFirstDead();
    if (!enemy) {

      enemy = new Enemy(this.scene, 0, 0);
      this.scene.enemies.add(enemy);
    }

    if (enemy) {
      enemy
        .setActive(true)
        .setVisible(true);

      // place at start of path
      let pathIndex = Math.floor(Math.random() * this.scene.level.paths.length);
      enemy.enable(pathIndex, enemyData);

      this.nextEnemy = time + this.nextDelay * ( time < this.hugeWaveOverTime ? 0.3 : 1 );
    }
  }
}