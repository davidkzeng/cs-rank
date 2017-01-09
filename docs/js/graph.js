function createGraph(schools, school_indices, matrix, ranking) {

  // Take transpose so matrix represents where professors are headed to
  // So large = lots of professors being hired at other uni.
  matrix = _.map(matrix, function(col, i) {
    return _.map(matrix, function(row) {
      return row[i];
    });
  });

  // Create matrix only containg top 15 ranked schools.
  top_matrix = [];
  for (var i = 0; i < 15; i++) {
    top_matrix.push([]);
    var school_i = school_indices[ranking[i][1]];
    for (var j = 0; j < 15; j++) {
      var school_j = school_indices[ranking[j][1]];
      top_matrix[i].push(parseInt(matrix[school_i][school_j]));
    }
  }

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
    .range(["#A4C5F9", "#4286F4", "#BAF9A4", "#C9712A"]);

  var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .datum(chord(top_matrix));

  var group = g.append("g")
    .attr("class", "groups")
    .selectAll("g")
    .data(function(chords) { return chords.groups; })
    .enter().append("g")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

  group.append("title").text(function(d, i) {
    return ranking[i][1] + ": " + d.value + " origins";
  });

  var groupPath = group.append("path")
    .style("fill", function(d) { return color(d.index); })
    .style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
    .attr("d", arc)
    .attr("id", function(d, i) { return "group" + i; });

  var groupText = group.append("text")
    .attr("x", 6)
    .attr("dy", 15);

  groupText.append("textPath")
    .attr("xlink:href", function(d, i) { return "#group" + i; })
    .text(function(d, i) {
      return ranking[i][3] ? ranking[i][3] : ranking[i][1];
    });

  groupText.filter(function(d, i) { return groupPath._groups[0][i].getTotalLength() / 2 - 25 < this.getComputedTextLength(); })
      .remove();

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