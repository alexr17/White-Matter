//Alex R
//White Matter
//v0.1
//Neurological Electrical Probe Geometry Generation

var fs = require('fs');
var probe = JSON.parse(fs.readFileSync('probe-geometry.JSON', 'utf8'));

var data = {}
data["name"] = probe.name
data["numE"] = probe.numE
data["width"] = probe.shankSpace*(probe.numShanks-1)+probe.horSpacHigh*(probe.numCol-1)*probe.numShanks
data["height"] = probe.height

var x = [] //for geometry
var y = []

function generateRow (arr, startX, startY, horSpac) {
  if (arr.length == 1) { //the electrode has to be in the middle so x has to be startX
    x.push(startX)
    y.push(startY)
  } else {
    for (var e in arr) { //now if there are multiple electrodes in the row startX will be in the middle and from there we have to determine the location of the first element
      x.push(startX)
      y.push(startY)
      startX += horSpac //move the position to the right
    }
  }
}

/*
this function is necessary because often the starting x value of a row is not obvious

arrLen -- an int that specifies the length of an array
numRows -- an int that specifies the number of rows
midX -- see generateShank()
jj -- an int for the index of the array

*/
function generateStartX(arrLen, numRows, midX, jj) {
  var horSpac;
  if (numRows - jj < probe.lowRows) { //stupid modifier for the bottoms of shanks
    horSpac = probe.horSpacLow
  } else {
    horSpac = probe.horSpacHigh
  }
  if (probe.numCol == 1) { //if there is only one column per shank
    return midX
  } else if (probe.numCol == 2) {
    if (arrLen == 2) { //if the columns are aligned horizontally
        return midX - horSpac
    } else { //the columns are staggered --note this assumes the first electrode is on the right ex:
      /*     e       e <-- index 0
          e       e
             e       e <-- index 2
          e       e
          ...     ...
            e       e
           e       e <-- bottom index
      */
      return midX + horSpac*((jj%2 == 0) ? 1 : -1)/2 //negative or positive shift
    }
  } else if (probe.numCol == 3) {  //if it's a tetrode
    if (arrLen == 1) { //middle
      return midX
    } else if (arrLen == 2) { //sides
      return midX - horSpac/2
    } else {
      console.log(arrLen)
      console.log("3 col probe has 3 elements in row: " + jj)
      process.exit(-1)
    }
  } else {
    console.log("arrLen: " + arrLen)
    console.log("midX: " + midX)
    console.log("jj: " + jj)
    process.exit(-1)
  }
}

/*
generate the geometry for a shank

midX -- an int that specifies the middle of the shank
startY -- an int that specifies the top of the shank (normally 0)
arr -- an array of arrays of electrodes for one shank
*/
function generateShank (midX, startY, arr) { //to generate the data for one shank
  var startX;
  for (var jj = 0; jj < arr.length; jj++) {
    startX = generateStartX(arr[jj].length, arr.length, midX, jj)
    if (arr.length-jj < probe.lowRows) {//if at the bottom and the horizontal spacing needs to change
      generateRow(arr[jj], startX, startY, probe.horSpacLow)
    } else {
    generateRow(arr[jj], startX, startY, probe.horSpacHigh)
    }
    startY += probe.verSpac //shift the y-val
  }
}

function generateGeometry () {//this function generates the x, y coords and orders them by the probe number
  var eVal = []
  for (var key in probe.probeMap) {
    generateShank(parseInt(key)*probe.shankSpace,0,probe.probeMap[key])
    eVal = eVal.concat(probe.probeMap[key].map(function(e){return e.join(',')}).join(',').split(',').map(Number)) //this is a fat mess but it basically converts the arrays on arrays of electrode values into a 1D array of integer values
  }
  //now the x's and y's have all the desired values 
  //at this point we can start mapping the electrode and adaptor values to the points
  data.probeGeometry = []
  for (var ii = 0; ii < probe.numE; ii++) { //append the data
    data.probeGeometry.push({"electrodeNum":eVal[ii],"x":x[ii],"y":y[ii]})
  }
  //sort by electrode number
  data.probeGeometry = data.probeGeometry.sort(function (a,b) {
    if (a.electrodeNum > b.electrodeNum) return 1;
    if (a.electrodeNum < b.electrodeNum) return -1;
  })
  
}

function rankByYCoord () { //this function sorts by the y coord
  data.probeGeometry = data.probeGeometry.sort(function (a,b) {
    if (a.y > b.y) return 1;
    if (a.y < b.y) return -1;
    if (a.x < b.x) return 1;
    if (a.x > b.x) return -1;
  })
}

function addAdaptorVal () { //adding the adaptor values to the data
  var adapData = probe.adaptorMap.map(function(e) { return e.split(' ').map(Number) })
  var objArr = {}
  var x = {}
  for (var arr of adapData) { //go through the adaptor data and create an object where each key is the electrode and the value is the adaptor values 
    objArr[arr[0]] = []
    for (var name of probe.adaptorNames) {
      var obj = {}
      obj[name] = arr[objArr[arr[0]].length+1]
      objArr[arr[0]].push(obj)
    }
  }
  for (var obj of data.probeGeometry) { //assign it to the main data
    obj["adaptorVals"] = objArr[obj.electrodeNum]
  }  
}


generateGeometry()
addAdaptorVal()
rankByYCoord()

console.log(data)

//fs.writeFileSync('Sorted-Probe-Coords.JSON', JSON.stringify(data, null, 2),'utf8') //write to file step A: the sorted electrode values

//data.probeGeometry = rankByYCoord()

//fs.writeFileSync('Sorted-YCoord-Probe.JSON', JSON.stringify(data, null, 2),'utf8') //write to file step B: the sorted y-coords

//csvData = addAdaptorVal()

//fs.writeFileSync('UCLA64G HS640.csv', csvData,'utf8') //write to file step C: mapping to the adaptor values

//console.log(csvData)