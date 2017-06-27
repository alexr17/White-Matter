var plotly = require('plotly')('anicolas', 'WmmMkswSq6Wwlh5FpRIc');
trace1 = {
  x: [/*data*/], 
  y: [/*data*/], 
  line: {color: 'rgba(31,119,180,1)'}, 
  type: 'scatter',  
};
trace2 = {
  x: [/*data*/], 
  y: [/*data*/], 
  line: {color: 'rgba(255,127,14,1)'}, 
  type: 'scatter', 
  visible: false
};
var list = []
for (var ii = 0; ii < 20; ii++) {
  list.push({
    args: ['line.color'],
    label: ii,
    method: 'restyle'
  })
}
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
  xaxis: {
    autorange: true,
    showgrid: false,
    zeroline: false,
    showline: false,
    autotick: true,
    ticks: "",
    showticklabels: false
  },
  yaxis: {
    autorange: true,
    showgrid: false,
    zeroline: false,
    showline: false,
    autotick: true,
    ticks: "",
    showticklabels: false
  }
};
plotly.plot(data, {layout: layout, fileopt: "overwrite"}, function(err, msg) {
  console.log(msg);
});