function createGraph(schools, school_indices, matrix, ranking) {
  // Take transpose so matrix represents where professors are headed to
  // So large = lots of professors being hired at other uni.
  matrix = _.map(matrix, function(col, i) {
    return _.map(matrix, function(row) {
      return row[i];
    });
  });
  console.log(matrix);
  matrix = _.slice(matrix, 0, 20);
  matrix = _.map(matrix, function(n) {
    return _.map(_.slice(n, 0, 20), function(i) {
      return parseInt(i);
    });
  });

  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      outerRadius = Math.min(width, height) * 0.5 - 10,
      innerRadius = outerRadius - 24;

  var formatPercent = d3.format(".1%");

  var chord = d3.chord()
    .sortSubgroups(d3.descending)
    .sortChords(d3.ascending)
    .padAngle(0.04);

  var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  var ribbon = d3.ribbon()
    .radius(innerRadius);

  var color = d3.scaleOrdinal()
    .domain(d3.range(4))
    .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

  var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .datum(chord(matrix));

  var group = g.append("g")
    .attr("class", "groups")
    .selectAll("g")
    .data(function(chords) { return chords.groups; })
    .enter().append("g")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

  group.append("title").text(function(d, i) {
    return schools[i] + ": " + d.value + " origins";
  });

  group.append("path")
    .style("fill", function(d) { return color(d.index); })
    .style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
    .attr("d", arc);

  var ribbons = g.append("g")
    .attr("class", "ribbons")
    .selectAll("path")
    .data(function(chords) { return chords; })
    .enter().append("path")
    .attr("d", ribbon)
    .style("fill", function(d) { return color(d.target.index); })
    .style("stroke", function(d) { return d3.rgb(color(d.target.index)).darker(); });

  function mouseover(d, i) {
    ribbons.classed("fade", function(p) {
      return p.source.index != i && p.target.index != i;
    });
  }

  function mouseout(d, i) {
    ribbons.classed("fade", function(p) {
      return false;
    });
  }
}

function createMatrix(data) {
  var schools = data[0];
  var matrix = data.slice(1, data.length);
  var school_indices = _.zipObject(schools, _.range(0, schools.length));
  loadRanking('', function(ranking) {
    createGraph(schools, school_indices, matrix, ranking);
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