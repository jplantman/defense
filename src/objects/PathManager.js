class PathManager {
  constructor(scene){
    this.scene = scene;

    this.setupGrid();
    this.createPaths();

    // let timedEvent = this.scene.time.addEvent(
    // {
    //   delay: 3000,
    //   callback: function () {
    //     this.removePaths();
    //   },
    //   callbackScope: this
    // });
  }

  setupGrid() {
    this.scene.level = this.getLevel();

    //
    let newPath = this.generatePath();
    this.scene.level.paths[0] = newPath;
    //

    this.scene.level.grid = [];
    for (let i = 0; i < 10 * this.scene.level.scaleFactor; i++) {
      this.scene.level.grid[i] = [];
      for (let k = 0; k < 10 * this.scene.level.scaleFactor; k++) {
        // block out middle 4 squares
        let midk = (k == 5 * this.scene.level.scaleFactor || k == 5 * this.scene.level.scaleFactor - 1);
        let midi = (i == 5 * this.scene.level.scaleFactor || i == 5 * this.scene.level.scaleFactor - 1);
        if (midk && midi) {
          this.scene.level.grid[i].push(1);
          // console.log('middle detected at: ', i, k)
        } else {
          this.scene.level.grid[i].push(0);
        }
      }
    }
  }

  generatePath(data = {}) {
    let path = {
      color: data.color || "0xE83C3B",
      points: []
    }

    path.points[0] = [-32, -32];
    path.points[1] = [231, 91];

    let tries = 0;
    let done = false;
    let alternator = true;
    while (!done && tries < 40){
      let step1 =  Math.floor( Math.random() * 300) - 50;
      let step2 = Math.floor(Math.random() * 300) - 50;
      tries += 1;
      var last = path.points[ path.points.length-1 ];
      var next = path.points[path.points.length];
      if (alternator){
        next = [last[1], last[0]];
      }
      else {
        next = [last[1]+step1, last[0]+step2];
      }
      alternator = !alternator;

      if (next[1] >= 1280 || next[0] >= 1280){
        next = [1280, 1280];
        done = true;
      }
      path.points.push(next)
    }
    console.log(path);
    return path;
  }

  createPaths() {
    this.scene.paths = [], this.scene.graphics = [];
    for (let k = 0; k < this.scene.level.paths.length; k++) {
      const pathData = this.scene.level.paths[k];
      this.scene.graphics[k] = this.scene.add.graphics();
      this.scene.paths[k] = this.scene.add.path(
        pathData.points[0][0],
        pathData.points[0][1]);

      for (let i = 1; i < pathData.points.length; i++) {
        // console.log(i, this.scene.level.points[i])
        this.scene.paths[k].lineTo(
          pathData.points[i][0],
          pathData.points[i][1]);
      }
      this.scene.graphics[k].lineStyle(3, pathData.color, 1); // 0xFFAE4D
      this.scene.paths[k].draw(this.scene.graphics[k]);
    }

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
          color: "0xE8DB3B", // yellow
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

  removePaths(whichOnes) {
    for (let i = 0; i < this.scene.paths.length; i++) {
      if (whichOnes.includes(i)){
        this.scene.paths[i] = null
        this.scene.graphics[i].setActive(false).setVisible(false)
      }
    }
  }
}