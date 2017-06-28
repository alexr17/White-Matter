var fs = require('fs')
var plotly = require('plotly')('WhiteMatter', 'hBY86ojuUrl5lGJWmETq');


var file_path = '/Users/Alex/Desktop/WhiteMatterSummer2017/Scraper/'

var names = fs.readFileSync(file_path + 'File_Names.txt', 'utf8').split(',')
//console.log(data)
//for buttons:
var xVals = fs.readFileSync(file_path + 'X_Values.txt', 'utf8').split('\n')
var yVals = fs.readFileSync(file_path + 'Y_Values.txt', 'utf8').split('\n')

var bools = new Array(names.length).fill(false)


var list = []
var data = []
for (var ii = 0; ii < names.length; ii++) {
  data.push({
    x: xVals[ii].split(',').map(Number),
    y: yVals[ii].split(',').map(Number),
    mode: 'markers',
    size: 15, // in microns
    type: 'scatter',
    name: names[ii],
    visible: false,
    color: 'red'
  })
  list.push({
    args: ['visible',bools.slice()],
    label: names[ii],
    method: 'restyle',
  })
  //console.log(data[ii].x)
}

for (var ii = 0; ii < list.length; ii++) {
  //console.log(list[ii].args)
  list[ii].args[1][ii] = true
  //console.log(bools)
}
//console.log(list[1000].args[1])
//console.log(list)

layout = {
  title: 'Neuronexus Probe Electrodes Maps',
  updatemenus: [
    {
      buttons: list
    }
  ],
  yanchor: 'top',
  xaxis: {
    
    title: "Microns",
    showgrid: true,
    autotick: true,
    linecolor: '#d3d3d3',
    mirror: "ticks",
    autorange: true

  },
  yaxis: {
    
    title: "Microns",
    showgrid: false,
    autotick: true,
    linecolor: '#d3d3d3',
    mirror: "ticks",
    autorange: true

  },

  margin: {
    l: 50,
    r: 50,
    b: 100,
    t: 100,
    pad: 4
  }
};


plotly.plot(data, {layout: layout, fileopt: "overwrite"}, function(err, msg) {
  console.log(msg)
  console.log(err);
});

