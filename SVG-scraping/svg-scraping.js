var cheerio = require('cheerio')
var fs = require('fs')
var stats = require('stats-lite')
var svg_points = require('svg-points')

var f_name = 'A1x16-Poly2-Std.svg'
var html = fs.readFileSync(f_name, 'utf8')
var data = ''
var pts = []
var diffs = []
var p_name = ''

$ = cheerio.load(html, { xmlMode: true });
p_name = $()

$('polygon').each(function(i, e) {
  
  data = $(this).attr('points').replace(/\s+|\n|\r/g,' ').split(' ')
  data.pop()
  //console.log(pts.length) //number of vertices for each probe electrode is 36?
  if (data.length == 36) {
    //console.log(data)
    
    pts.push(data.map(function(e) {
      return e.split(',').map(Number)
    }))
    //console.log(pts[ii])

  }
})
for (var ii = 0; ii < pts.length; ii++) {
  if (ii < pts.length-1) {
    for (var jj = 0; jj < pts[ii].length; jj++) {
      diffs.push((pts[ii][jj][1]-pts[ii+1][jj][1]).toFixed(3))
    }
  }
}
console.log("for the probe: " + f_name.replace('.svg',''))
console.log("mean diff: %s", stats.mean(diffs).toFixed(3))
console.log("standard deviation: %s", stats.stdev(diffs).toFixed(3))

var obj = {type: "path", d: "m 0,0 0,58.569 101.646,0 0.944,-0.03 0.945,-0.091 0.945,-0.152 0.944,-0.212 0.945,-0.269 0.944,-0.326 0.945,-0.38 0.945,-0.433 0.944,-0.483 0.945,-0.528 0.944,-0.572 0.945,-0.611 0.945,-0.649 0.945,-0.679 0.945,-0.707 0.944,-0.731 0.945,-0.75 0.945,-0.763 0.945,-0.774 1.889,-1.557 0.945,-0.773 0.944,-0.764 0.945,-0.75 0.945,-0.73 0.944,-0.707 0.945,-0.679 0.944,-0.649 0.945,-0.611 0.944,-0.572 0.945,-0.529 0.945,-0.482 0.944,-0.433 0.945,-0.381 0.944,-0.325 0.945,-0.27 0.945,-0.211 0.944,-0.152 0.945,-0.092 0.945,-0.03 432.228,-6.222 33.063,0 0.176,-0.033 6.866,-3.192 -6.866,-3.19 -0.176,-0.035 -33.063,0 -432.228,-6.221 -0.945,-0.031 -0.945,-0.091 -0.944,-0.153 -0.945,-0.211 -0.945,-0.269 -0.944,-0.326 -0.945,-0.381 -0.944,-0.433 -0.945,-0.482 -0.945,-0.528 -0.944,-0.573 -0.945,-0.611 -0.944,-0.648 -0.945,-0.68 -0.944,-0.707 -0.945,-0.73 -0.945,-0.75 -0.944,-0.764 -0.945,-0.774 L 119.595,9.141 118.65,8.367 117.705,7.604 116.76,6.854 115.816,6.124 114.871,5.416 113.926,4.738 112.981,4.089 112.036,3.478 111.092,2.905 110.147,2.378 109.203,1.895 108.258,1.462 107.313,1.081 106.369,0.755 105.424,0.486 104.48,0.275 103.535,0.122 102.59,0.031 101.646,0 0,0 Z"}
console.log(JSON.stringify(svg_points.toPoints(obj), null, 2))