var fs = require('fs')

var probeNames = ['64D','64E','64F','64G']
var pdfData = []
var data = fs.readFileSync('UCLA probe specs (1).txt', 'utf8')

for (var ii = 0; ii < probeNames.length; ii++) {
  pdfData.push(data.slice(data.indexOf(probeNames[ii]),data.indexOf(probeNames[ii+1])))
}

for (var jj = 0; jj < pdfData.length; jj++) {
  var arr = pdfData[jj].split('\n')
  var name = arr.shift()
  var numShanks = arr.shift().split(' ').length //this is all specific to the file format so this will all need to change
  //more formatting
  var index = arr.indexOf(arr.find(function(e) { //where the specs start and the data ends to separate the two
    return ((e.match(/[a-z]/g) != null) ? true : false)
  }))
  var electrodes = arr.splice(0,index)
  
  //get specs about geometry

  var shankSpace = 0
  var height = 0;
  var verSpac = 0;
  var horSpacLow = 0;
  var horSpacHigh = 0;
  
  for (var kk = 0; kk < arr.length; kk ++ ) { //all for geometric specs
    if (arr[kk].includes(' mm') && shankSpace == 0 && numShanks > 1) { //space between shanks
      shankSpace = parseFloat(arr[kk].replace(/[^\d|.]/g,''))*1000
    } else if (arr[kk].includes(' mm')) {
      height = (arr[kk].replace(/[^\d|.]/g,''))*1000
    } else if (arr[kk].includes('horizontal')) { //horizontal spacing
      var x = arr[kk].replace(/[^\d|-]/g,'').split('-')
      horSpacLow = x[0]
      horSpacHigh = x[1]
    } else if (arr[kk].includes('vertical')) {
      verSpac = (arr[kk].replace(/[^\d|-]/g,''))
    }
  }


  var linearProbe = []
  var shanks = []
  var nums = []
  for (var hh = 0; hh < electrodes.length; hh++) {
    
    nums.push(electrodes[hh].split(' ').map(Number))
    
  }
  if (numShanks > 1) {  
    for (var ll = 0; ll < numShanks; ll++) { //0 ... 1 ... 2
      for (var ii = 0; ii < nums.length; ii++) {
        var spac = nums[ii].length/numShanks //nums-->12 numShanks --> 3 spac --> 4
        for (var mm = 0; mm < spac; mm++) { //0,1,2,3 ... 4,5,6,7 ... 8,9,10,11
          //linearProbe.push(m+ll*spac)
          linearProbe.push(nums[ii][mm+ll*spac])
        }
      }
    }  
  } else {
    for (num of nums) {
      linearProbe.push(num)
    }
  }
  console.log(linearProbe)
  //console.log(shanks)
}



function Probe(name,length,numShanks) {
  this.name = name
  this.length = length
  this.verSpac = 0
  this.horSpacLow = 0
  this.horSpacHigh = 0
  this.lowLen = 1
  this.numCol = 1 //number of columns per shank
  this.numShanks = numShanks
  this.linearProbe = []
  this.adaptorMap = ["1 37 14","2 47 30","3 41 16","4 43 32","5 46 10","6 50 26","7 52 12","8 55 28","9 54 6","10 58 22","11 57 8","12 60 24","13 61 2","14 64 18","15 63 4","16 51 20","17 27 15","18 35 31","19 30 13","20 40 29","21 33 11","22 44 27","23 36 9","24 49 25","25 39 7","26 59 23","27 42 5","28 53 21","29 62 17","30 48 1","31 56 19","32 45 3","33 7 61","34 5 45","35 4 63","36 1 47","37 9 43","38 10 59","39 14 41","40 13 57","41 18 39","42 16 55","43 23 37","44 19 53","45 26 35","46 22 51","47 31 33","48 25 49","49 3 46","50 2 62","51 8 48","52 6 64","53 12 42","54 11 58","55 17 44","56 15 60","57 21 38","58 20 54","59 29 40","60 24 56","61 34 34","62 28 50","63 38 36","64 32 52"]
}