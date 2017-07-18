var fs = require('fs')

var data = fs.readFileSync('raw-adaptor-data.txt','utf8')
var intData = fs.readFileSync('raw-interface-data.txt','utf8')
var obj = {}
var arr = data.split('\n')
var newMap = true //when a new adaptor map needs to generated
var nums = []
var aNames = []
var names = []
var first = false
for (var ii = 0; ii < arr.length; ii++) {
  if (ii == 0 || newMap == true) { //if we are starting with a new map
    if (obj[arr[ii]] == null) { //if there already exists an object of name
      obj[arr[ii]] = [] //intialize the object
      //console.log(arr[ii])
    }
    aNames.push(arr[ii]) //get the name of the adaptor
    //console.log(objName)
    names.push(arr[ii+2]) //name of the other adaptor
    newMap = false
    first = true
  } else if (arr[ii] == "") { //next time start with a new map
    newMap = true
     //set the next name
  } else if (arr[ii].length > 10) { //data to import
    nums = arr[ii].split(' ')
    var len = aNames.length
    if (first) {
      for (var jj = 0; jj < nums.length; jj++) {
        if (aNames.indexOf(aNames[len-1]) == len-1 ) {
          //console.log('new adaptor')
          obj[aNames[len-1]][jj] = {"pos": jj, "e_num": "", "a_vals": {}}
        }
        obj[aNames[len-1]][jj]["a_vals"][names[names.length-1]] = {"pos": null, "e_num": (nums[jj])}
      }
      first = false
    } else {
      for (var jj = 0; jj < nums.length; jj++) {
        obj[aNames[len-1]][jj]["a_vals"][names[names.length-1]]["pos"] = nums.indexOf(obj[aNames[len-1]][jj]["a_vals"][names[names.length-1]]["e_num"])
        //console.log("pos: " + nums.indexOf(obj[objName][jj]["a_vals"][names[names.length-1]]["e_num"]))
      }
    }
  }
}
fs.writeFileSync('new-NN-adaptors.json', JSON.stringify(obj, null, 2), 'utf8')