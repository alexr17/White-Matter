

var fs = require('fs');
var probe = JSON.parse(fs.readFileSync('probe-example.JSON', 'utf8'));

var data = {}
data["name"] = probe.name
data["length"] = probe.length

var x = [] //for geometry
var y = []

function generateShank (len, startIndex, startX) { //to generate the data for one shank
  for (var jj = startIndex; jj >= 0; jj--) {
    if (jj == len-1) { //first val
      x[jj] = startX
      y[jj] = 0
    } else if (jj == len-2) { //second val
      x[jj] = startX
      y[jj] = probe.verSpac
    } else {
      if ((jj+1)%probe.numCol == 0) { //for when the electrode is in the middle 
        x[jj] = startX
        y[jj] = y[jj+1]+probe.verSpac

      } else { //when it isn't
        if (jj > len-2-probe.numCol*probe.lowLen) { //magic numbers are hard to figure out but this basically accounts for at the bottom when the spacing is unusually small
          x[jj] = probe.horSpacLow/2*((jj%probe.numCol==1) ? 1 : -1)
        } else {
          x[jj] = probe.horSpacHigh/2*((jj%probe.numCol==1) ? 1 : -1)
        }
        if (jj%probe.numCol==1) {
          y[jj] = y[jj+1]+probe.verSpac
        } else {
          y[jj] = y[jj+1]
        }
      } 
    }
  }
}

function generateGeometry () {//this function generates the x, y coords and orders them by the probe number
  //generateShank()

    

  data.probeGeometry = []

  for (var ii = 0; ii < probe.length; ii++) {
    data.probeGeometry.push({"electrodeNum":probe.linearProbe[ii]/*,"x":x[ii],"y":y[ii]*/})
  }

  /*
  data.probeGeometry = data.probeGeometry.sort(function (a,b) {
    if (a.electrodeNum > b.electrodeNum) return 1;
    if (a.electrodeNum < b.electrodeNum) return -1;
  })
  */
}

function rankByYCoord () { //this function sorts by the y coord
  var ySort = data.probeGeometry.sort(function (a,b) {
    if (a.y > b.y) return 1;
    if (a.y < b.y) return -1;
    if (a.x < b.x) return 1;
    if (a.x > b.x) return -1;
  })
  return ySort
}

function addAdaptorVal () {
  var adapData = probe.adaptorMap.map(function(e) { return e.split(' ').map(Number) })
  var objArr = {}
  for (var arr of adapData) {
    objArr[arr[0]] = arr[1]
  }
  var newArr = []
  for (var obj of data.probeGeometry) {
    newArr.push(objArr[obj.electrodeNum])
  }
  //console.log(newArr)
  return newArr
}

generateGeometry()

//fs.writeFileSync('Sorted-Probe-Coords.JSON', JSON.stringify(data, null, 2),'utf8') //write to file step A: the sorted electrode values

//data.probeGeometry = rankByYCoord()

//fs.writeFileSync('Sorted-YCoord-Probe.JSON', JSON.stringify(data, null, 2),'utf8') //write to file step B: the sorted y-coords

csvData = addAdaptorVal()

//fs.writeFileSync('UCLA64G HS640.csv', csvData,'utf8') //write to file step C: mapping to the adaptor values

//console.log(csvData)