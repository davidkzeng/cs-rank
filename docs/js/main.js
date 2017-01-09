DISPLAY_ROWS = 50;

function createRanking(data) {
  $parent = $('#ranking_body');
  for (var i = 0; i < Math.min(DISPLAY_ROWS, data.length); i++) {
    var row = $('<tr>');
    for (var j = 0; j < 3; j++) {
      row.append($('<td>').html(data[i][j]));
    }
    $parent.append(row);
  }
  $('.ranking').removeClass('hidden');
}

function loadRanking(filter, callback) {
  if (!filter) {
    filter = '';
  } else {
    filter = '_' + filter;
  }
  var url = 'https://d26rye1dosvzkf.cloudfront.net/ranking_list' + filter + '.txt';
  Papa.parse(url, {
    download: true,
    delimiter: ",",
    complete: function(res) {
      if (callback) {
        callback(res.data);
      } else {
        createRanking(res.data);
      }
    }
  });
}

function reloadRanking(filter) {
  $('.ranking').addClass('hidden');
  $('#ranking_body').empty();
  loadRanking(filter);
}

$('.options input[type=radio]').on('change', function() {
  reloadRanking(this.value);
});

loadRanking('');
loadMatrix();