// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};


var gameStats = {
  score: 0,
  bestScore: 0
};

var gameBoard = d3.select("body").append("svg")
    .attr("width", gameOptions.width)
    .attr("height", gameOptions.height);

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var createEnemies = function() {
  var enemies = [];
  for (var i = 0; i < gameOptions.nEnemies; i++) {
    enemies.push({
      id: i,
      x: Math.random()*100,
      y: Math.random()*100
    });
  }

  return enemies;
};

var enemies = createEnemies(); // spits out an array of 30 objects enemies that does nothing.

var Player = function() {
  this.id = 1;
  this.x = axes.x(50);
  this.y = axes.y(50);
  this.angle = 0;
  this.r = 5;
  this.path = "m-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z";
  this.fill = "#ff6600";
};

var player = new Player();

var dragmove = function () {
  var dx = d3.event.dx;
  var dy = d3.event.dy;
  var x = Math.min(gameOptions.width-15, Math.max(d3.event.x, 15));
  var y = Math.min(gameOptions.height-15, Math.max(d3.event.y, 15));
  player.x = x;
  player.y = y;
  var angle = 360 * (Math.atan2(dy, dx) / (Math.PI * 2));
  player.angle = angle;
  d3.select(this).attr("transform", function(){
      var rotate = "rotate(" + angle + "," + x + "," + y + ") ";
      var translate = "translate(" + x + "," + y + ")";

      return rotate + translate;
    });
};

var drag = d3.behavior.drag()
    .on("drag", dragmove);

var checkCollision = function () {
  var enemies = gameBoard.selectAll("circle");

  var playerX = player.x;
  var playerY = player.y;

  // console.log(playerX + ", " + playerY);

  enemies.each(function(d, i){
      var enemy = d3.select(this);
      var enemyX = enemy.attr("cx");
      var enemyY = enemy.attr("cy");
      var proximityDistance = Math.sqrt(Math.pow((playerX - enemyX), 2) + Math.pow((playerY - enemyY), 2));
      // if (proximityDistance < (player.r + d.r)) {
      if (proximityDistance < parseFloat(enemy.attr("r")) + player.r) {
        // console.log(parseFloat(enemy.attr("r")) + player.r);
      }

      if (i === 0) {
        enemy.attr("class", "enemy2");
        // console.log("enemy0: " + enemyX + ", and " + enemyY);
      }
    }
  );
};

setInterval(function() {
  checkCollision();
}, 10);


var updatePlayer = function (data){

  var player = gameBoard.selectAll("path")
      .data(data, function(d){ return d.id; });

  player.enter().append("svg:path")
    .attr("class", "player")
    .attr("d", function(d){return d.path;})
    .attr("fill", function(d){return d.fill;})
    .attr("transform", function(d){
      var rotate = "rotate(0," + d.x + "," + d.y + ") ";
      var translate = "translate(" + d.x + "," + d.y + ")";

      return rotate + translate;
    })
    .style("cursor", "pointer")
    .call(drag);
};


var updateEnemies = function (data) {

  // DATA JOIN
  // Join new data with old elements, if any.
  var enemies = gameBoard.selectAll("circle")
      .data(data, function(d){ return d.id; });

  // UPDATE
  // Update old elements as needed.
  enemies.transition()
      .duration(1000)
      .attr("cx", function(d, i) { return axes.x(d.x); })
      .attr("cy", function(d, i) { return axes.y(d.y); });
      // .tween('custom', tweenWithCollisionDetection);


  // ENTER
  // Create new elements as needed.
  enemies.enter().append("svg:circle")
      .attr("class", "enemy")
      .attr("cx", function(d, i) { return axes.x(d.x); })
      .attr("cy", function(d, i) { return axes.y(d.y); })
      .attr("r", 10)
      .transition()
      .duration(1000);
      // .tween('custom', tweenWithCollisionDetection);

  // ENTER + UPDATE
  // Appending to the enter selection expands the update selection to include
  // entering elements; so, operations on the update selection after appending to
  // the enter selection will apply to both entering and updating nodes.
  // text.text(function(d) { return d; });

  // EXIT
  // Remove old elements as needed.
  // text.exit().remove();
};

updatePlayer([player]);

// The initial display.
updateEnemies(enemies);

// Grab a random sample of letters from the alphabet, in alphabetical order.
setInterval(function() {
  updateEnemies(createEnemies());
}, 1000);





// var tweenWithCollisionDetection = function(endData) {
//   var enemy = d3.select(this);
//   var player = d3.select(".player");
//   var xDiff = parseFloat(enemy.attr("cx")) - player.x;
//   var yDiff = parseFloat(enemy.attr("cy")) - player.y;
//   var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
//   var radiusSum = enemy.attr("r") + player.r;
//   if (separation < radiusSum) {
//     return console.log("FML");
//   }
// };

// var checkCollision = function(enemy, collidedCallback) {

//   return _(players).each(function(player) {
//     var radiusSum, separation, xDiff, yDiff;
//     radiusSum = parseFloat(enemy.attr('r')) + player.r;
//     xDiff = parseFloat(enemy.attr('cx')) - player.x;
//     yDiff = parseFloat(enemy.attr('cy')) - player.y;
//     separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
//     if (separation < radiusSum) return collidedCallback(player, enemy);

//   });
// };


// var tweenWithCollisionDetection = function(endData) {
//   var endPos, enemy, startPos;
//   enemy = d3.select(this);
//   startPos = {
//     x: parseFloat(enemy.attr('cx')),
//     y: parseFloat(enemy.attr('cy'))
//   };
//   endPos = {
//     x: axes.x(endData.x),
//     y: axes.y(endData.y)
//   };


//   return function(t) {
//     var enemyNextPos;
//     checkCollision(enemy, onCollision);
//     enemyNextPos = {
//       x: startPos.x + (endPos.x - startPos.x) * t,
//       y: startPos.y + (endPos.y - startPos.y) * t
//     };
//     return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
//   };
// };




// var onCollision = function() {
//   console.log("A collision!");
// };

