function createGraph(school_indices, matrix, ranking) {
  var graph = {};
  graph.nodes = [];
  graph.links = [];

  for (var i = 0; i < ranking.length; i++) {
    var node = {
      "id": ranking[i][1],
      "value": Math.sqrt(ranking[i][2] * 10000),
      "group": i % 10
    };
    graph.nodes.push(node);
  }

  for (var i = 0; i < ranking.length; i++) {
    for (var j = i + 1; j < ranking.length; j++) {
      var iIdx = school_indices[ranking[i][1]];
      var jIdx = school_indices[ranking[j][1]];
      if (matrix[iIdx][jIdx] > 0) {
        var link = {
          "source": ranking[i][1],
          "target": ranking[j][1],
          "value": matrix[iIdx][jIdx],
        };
        graph.links.push(link);
      }
    }
  }

  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");
  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", function(d) {return Math.sqrt(d.value)});

  node.append("title")
      .text(function(d) { return d.id; });

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);
}

function createMatrix(data) {
  var schools = data[0];
  var matrix = data.slice(1, data.length);
  var school_indices = _.zipObject(schools, _.range(0, schools.length));
  loadRanking('', function(ranking) {
    createGraph(school_indices, matrix, ranking);
  });
}

function loadMatrix() {
  var url = 'https://d26rye1dosvzkf.cloudfront.net/adj.txt';
  Papa.parse(url, {
    download: true,
    delimiter: ",",
    complete: function(res) {
      createMatrix(res.data);
    }
  });
}