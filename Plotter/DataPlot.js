var fs = require('fs')
var plotly = require('plotly')('anicolas', 'WmmMkswSq6Wwlh5FpRIc');


var file_path = '/Users/Alex/Desktop/WhiteMatterSummer2017/Scraper/'

//read the file
if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + file_path);
  process.exit(-1);
}
var path = process.argv[2];

var names = fs.readFileSync(file_path + path, 'utf8').split(',\n')
//console.log(data)

//for buttons:



var bools = new Array(names.length).fill(false)
var list = []
for (var ii = 0; ii < names.length; ii++) {
  list.push({
    args: ['visible', replace(bools,ii)],
    label: names[ii],
    method: 'restyle'
  })
}
//console.log(list)

trace1 = {
  x: [4,3,2,1], 
  y: [8,7,6,5], 
  line: {color: 'rgba(31,119,180,1)'}, 
  type: 'scatter',
};
trace2 = {
  x: [4,3,2,1], 
  y: [5,6,7,8], 
  line: {color: 'rgba(255,127,14,1)'}, 
  type: 'scatter', 
  visible: false,
};

data = [trace1, trace2];
layout = {
  margin: {
    r: 10, 
    t: 25, 
    b: 40, 
    l: 60
  }, 
  title: 'Probe Electrode Locations',
  updatemenus: [
    {
      y: 0.7, 
      buttons: list
    }
  ],
  yanchor: 'top',
  xaxis: {
    autorange: true,
    showgrid: false,
    zeroline: true,
    showline: true,
    autotick: true,
    linecolor: '#d3d3d3',
    mirror: "ticks",
    showticklabels: false
  },
  yaxis: {
    autorange: true,
    showgrid: false,
    zeroline: true,
    showline: true,
    autotick: true,
    linecolor: '#d3d3d3',
    mirror: "ticks",
    showticklabels: false
  }
};

plotly.plot(data, {layout: layout, fileopt: "overwrite"}, function(err, msg) {
  console.log(msg);
});

function replace(array, index) {
  var array2 = array
  array2[index] = true
  console.log(array2)
  return array2
}