var fs = require('fs')

var data = fs.readFileSync('raw-adaptor-data.txt','utf8')
var obj = {}
var arr = data.split('\n')
var newMap = true //when a new adaptor map needs to generated
var nums = []
var objName = ""
var names = []
var first = false
for (var ii = 0; ii < arr.length; ii++) {
  if (ii == 0 || newMap == true) { //if we are starting with a new map
    if (obj[arr[ii]] == null) { //if there already exists an object of name
      obj[arr[ii]] = [] //intialize the object
      //console.log(arr[ii])
    }
    objName = arr[ii] //get the name of the adaptor
    //console.log(objName)
    names.push(arr[ii+2]) //name of the other adaptor
    newMap = false
    first = true
  } else if (arr[ii] == "") { //next time start with a new map
    newMap = true
    objName = ""
     //set the next name
  } else if (arr[ii].length > 10) { //data to import
    nums = arr[ii].split(' ')
    if (first) {
      for (var jj = 0; jj < nums.length; jj++) {
        if (names.length == 1) {
          obj[objName][jj] = {"pos": jj, "e_num": null, "a_vals": {}}
          obj[objName][jj]["a_vals"][names[0]] = {"pos": null, "e_num": (nums[jj])}      
        }
        obj[objName][jj]["a_vals"][names[names.length-1]] = {"pos": null, "e_num": (nums[jj])}
      }
      first = false
    } else {
      for (var jj = 0; jj < nums.length; jj++) {
        obj[objName][jj]["a_vals"][names[names.length-1]]["pos"] = nums.indexOf(obj[objName][jj]["a_vals"][names[names.length-1]]["e_num"])
        //console.log("pos: " + nums.indexOf(obj[objName][jj]["a_vals"][names[names.length-1]]["e_num"]))
      }
    }
  }
}
fs.writeFileSync('nn-adaptors.json', JSON.stringify(obj, null, 2), 'utf8')