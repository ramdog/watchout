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
    enemies.push({id: i, x: Math.random()*100, y: Math.random()*100});
  }

  return enemies;
};

var enemies = createEnemies();





var updateEnemies = function (data) {

  // DATA JOIN
  // Join new data with old elements, if any.
  var enemies = gameBoard.selectAll("circle")
      .data(data, function(d){ return d.id; });

  // UPDATE
  // Update old elements as needed.
  enemies.transition()
      .duration(750)
      .attr("cx", function(d, i) { return axes.x(d.x); })
      .attr("cy", function(d, i) { return axes.y(d.y); })


  // ENTER
  // Create new elements as needed.
  enemies.enter().append("svg:circle")
      .attr("class", "enemy")
      .attr("cx", function(d, i) { return axes.x(d.x); })
      .attr("cy", function(d, i) { return axes.y(d.y); })
      .attr("r", 10)
      .transition()
      .duration(750);

  // ENTER + UPDATE
  // Appending to the enter selection expands the update selection to include
  // entering elements; so, operations on the update selection after appending to
  // the enter selection will apply to both entering and updating nodes.
  // text.text(function(d) { return d; });

  // EXIT
  // Remove old elements as needed.
  // text.exit().remove();
};

// The initial display.
updateEnemies(enemies);

// Grab a random sample of letters from the alphabet, in alphabetical order.
setInterval(function() {
  updateEnemies(createEnemies());
}, 1000);
