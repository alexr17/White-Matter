var fs = require('fs')
var readline = require('readline')
var prevData = {}
var adaptor = {}
var data = fs.readFile('nn-adaptors.json','utf8', function(err,data) {
  if (err != null) {
    console.log(err)
  } else {
    console.log('This is an adaptor interface:')
    console.log('You can \'create\', \'edit\', and \'show\' attributes of the following adaptor object.')

    adaptor = JSON.parse(data)
    setTimeout(print,200,adaptor)

    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    setTimeout(print,600,'EX: \'show A16[0]\' --> {pos: 0, e_num: 9, adaptorVals: {Object Object} }\nNote -- if you want to edit an attribute, you must specify the attribute itself, not the parent')
    
    setTimeout(prompt,1000,rl,adaptor,'\nType \'exit\' to end. \n\nInput: ')
    //rl.close()
  }

})

function prompt(rl,adaptor,text) {
  
  rl.question(text, (answer) => {
    run(answer, rl, adaptor)
  });

}

function run(answer, rl, adaptor) {
  var keys = ['create','edit','show','exit','delete','sort','trace','fill','undo']
  answer = answer.split(' ')
  var kIndex;
  var aIndex;
  var text = "";
  kIndex = search(answer, keys)
  if (kIndex == -1) {
    text = '\nYou did not enter any proper keywords. \n\nInput: '
  
  } else {

    if (keys[kIndex] == 'exit') { //exiting the interface
      rl.close()
      return null
    
    } else if (keys[kIndex] == 'show') { //showing properties
      var show = answer.shift()

      if (eval('adaptor.' + show) != null) { //if properties are valid
        
        console.log(eval('adaptor.' + show))
        text = '\nDisplayed elements\n\nInput: '
      } else { //if they aren't

        text = '\nNot enough attributes provided\nshow <adaptor_name>.<property>\n\nInput: '
      }

    } else if (keys[kIndex] == 'create') { //creating adaptors
      
      if (answer.length < 4) { //not enough attributes
        text = '\nNot enough attributes provided\ncreate <adaptor_name> <adaptor_length> <a_val> <ordering> ... <a_val> <ordering> --note ordering currently has 3 possible values: \'normal\',\'reverse\',\'custom\'\n\nInput: '
      
      } else { //enough attributes
        var name = answer.shift()
        var length = answer.shift()
        var a_vals = answer
        /*
        if (adaptor[name] != null) {
          return prompt(rl, adaptor, '\nAn adaptor with the name \'' + name + '\' already exists!\n\nInput: ')
        } else if (isNaN(length) || length < 0){
          return prompt(rl, adaptor, '\n' + length + ' is not a valid length\n\nInput: ')
        } else {
          adaptor[name] = []
          var order = ['normal','reverse','custom']
          for (var ii = 0; ii < length; ii++) {
            var obj = {}
            for (var a of a_vals) {
              if (order.includes(a)) {
                //do nothing
              } else if (a == a_vals[a_vals.length-1]) {
                //do nothing
              } else {
                if (a_vals[a_vals.indexOf(a)+1] == 'normal') {
                  obj[a] = ii+1
                } else if (a_vals[a_vals.indexOf(a)+1] == 'reverse') {
                  obj[a] = length-ii
                } else {
                  obj[a] = ''
                }
              }
            }
            adaptor[name][ii] = {e_num: ii+1, a_vals: obj}
            obj = {}
          }
          //fs.writeFileSync('nn-adaptors.JSON',JSON.stringify(adaptor, null, 1),'utf8')
          }
          */ 
        text = '\nAdaptor generating has not been implemented yet\n\nInput: '
      
      }

    } else if (keys[kIndex] == 'edit') { //editing properties
      var edit = answer.shift()
      /*
      if (adaptor[edit] != null) {
        if (answer.length == 0) {
          return prompt(rl, adaptor, '\nNot enough attributes provided\nedit <adaptor_name>.<property> <new_value> \n\nInput: ')
        } else if (answer.length > 0) {
          if (!isNaN(answer[0])) {
            prevData = JSON.parse(JSON.stringify(adaptor));
            console.log('adaptor.' + edit + ' = ' + answer[0])
            eval('adaptor.' + edit + ' = ' + answer[0])
            //console.log('\n' + JSON.stringify(eval('adaptor.' + edit), null, 2))
            fs.writeFileSync('nn-adaptors.JSON',JSON.stringify(adaptor, null, 2),'utf8')
            return prompt(rl, adaptor, '\nAttribute modified.\n\nInput: ')
          } else {
            return prompt(rl, adaptor, '\nInvalid value\n\nInput: ')
          }
        } else {
          return prompt(rl, adaptor, '\nToo many arguments\n\nInput: ')
        }
      } else {
        return prompt(rl, adaptor, '\nNot enough attributes provided\nedit <adaptor_name>.<property> <new_value> \n\nInput: ')
      }
      */
      text = '\nEdit is still buggy and is not implemented yet\nedit <adaptor_name>.<property> <new_value> \n\nInput: '

    } else if (keys[kIndex] == 'delete') { //deleting adaptors
      if (answer.length == 0) { //not enough attribues
        text = '\nNot enough attributes provided\ndelete <adaptor_name> <adaptor_property>\n\nInput: '
      } else { //enough attributes
        var del = answer.shift()

        if (adaptor[del] != null) { //adaptor name is valid

          if (answer.length == 0) { //deleting just an adaptor
            eval('delete adaptor.' + del)
            console.log('delete adaptor.' + del)
            text = '\nAdaptor stuff deleted\n\nInput: '
       
          } else if (adaptor[del][0][answer[0]] != null) { //if the property is valid
            prevData = JSON.parse(JSON.stringify(adaptor));
            for (var ii = 0; ii < adaptor[del].length; ii++) {
              eval('delete adaptor.' + del + '[' + ii + '].' + answer[0])
              console.log('delete adaptor.' + del + '[' + ii + '].' + answer[0])
            }
            text = '\nAdaptor stuff deleted\n\nInput: '

          } else { //adaptor name or property isn't valid
            text = '\nInvalid property\n\nInput: '
          
          }

          fs.writeFileSync('nn-adaptors.JSON',JSON.stringify(adaptor, null, 2),'utf8')
        
        } else { //invalid      
          text = '\nInvalid property\n\nInput: '

        }
      }

    } else if (keys[kIndex] == 'sort') { //sorting an adaptor by a property
      if (answer.length < 3) { //invalid # of attributes
        text = '\nNot enough attributes provided\nsort <adaptor_name> by <property>\n\nInput: '
      
      } else {
        if (adaptor[answer[0]] == null) { //invalid adaptor name
          text = '\nIncorrect adaptor name\n\nInput: '
        
        } else if (adaptor[answer[0]][0][answer[2]] == null) { //invalid property
          text = '\nIncorrect property\n\nInput: '
        
        } else {
          //adaptor = sort(adaptor[answer[0]], answer[2])
          text = '\nSorting not implemented yet\n\nInput: '
        }

      }

    } else if (keys[kIndex] == 'trace') { //tracing an adaptor
      if (answer.length < 3) { //not enough attributes
        text = '\nNot enough attributes provided\ntrace <adaptor_name> <position> <final_adaptor>\n\nInput: '
      
      } else {
        if (adaptor[answer[0]] != null && adaptor[answer[0]].length > answer[1]) { //valid name and valid position
          var e = adaptor[answer[0]][answer[1]]
          
          if (e.a_vals[answer[2]] == null) { //invalid final adaptor
            text = '\ninvalid final adaptor\n\nInput: '
          
          } else {
            text = '\nThe trace from position ' + answer[1] + ' of adaptor ' + answer[0] + ' to ' + answer[2] + ':\n\n\t\tpos: ' + e.pos + ' --> ' + e.a_vals[answer[2]].pos + '\n\n\t\te_num: ' + e.e_num + ' --> ' + e.a_vals[answer[2]].e_num + '\n\nInput: '
          }

        } else {
          text = '\ninvalid attributes\n\nInput: '

        }

      }

    } else if (keys[kIndex] == 'fill') { //filling an adaptor property's contents
      if (answer.length < 2) { //not enough adaptors
        text = '\nNot enough attributes provided\nfill <adaptor_name> <property> <input_options> -- reverse or normal -- file used is \'raw-interface-data.txt\'\n\nInput: '

      } else if (eval('adaptor.' + answer[0] + '[0].' + answer[1]) == null) { //invalid attributes
        text = '\ninvalid attributes\n\nInput: '
      
      } else { //valid attributes
        var rd = fs.readFileSync('raw-interface-data.txt','utf8')
        rd = rd.split(' ')
        
        if (rd.length != adaptor[answer[0]].length) {
          text = '\nData is incomplete\n\nInput: '
        
        } else {
          if (answer[2] == 'reverse') {
            rd = rd.reverse()
            console.log('reversed')
          }

          prevData = JSON.parse(JSON.stringify(adaptor));
          for (var ii = 0; ii < rd.length; ii++) {
            console.log('adaptor.' + [answer[0]] + '[' + ii + ']' + '.' + answer[1] + ' = ' + rd[ii])
            eval('adaptor.' + [answer[0]] + '[' + ii + ']' + '.' + answer[1] + ' = ' + rd[ii])
          }
          fs.writeFileSync('nn-adaptors.JSON',JSON.stringify(adaptor, null, 2),'utf8')
          text = '\nAdaptor filled\n\nInput: '

        }

      }

    } else if (keys[kIndex] == 'undo') { //undoing a previous action
      if (prevData == {}) {
        text = '\nYou can\'t undo anything\n\nInput: '
      } else {
        fs.writeFileSync('nn-adaptors.json',JSON.stringify(prevData, null, 2))
        text = '\nUndid previous action (this only goes back one action)\n\nInput: '
      }
    
    }
  }

  return prompt(rl, adaptor, text)

}

function search(arr, keys) {
  var index
  for (var a of arr) {
    index = keys.indexOf(a)
    if (index != -1) {
      arr.splice(arr.indexOf(a), 1);
      return index
    }
  }
  return -1

}

function sort (arr, key) { //this function sorts by the y coord
  arr = arr.sort(function (a,b) {
    if (a.key > b.key) return 1;
    if (a.key < b.key) return -1;
  })
  //console.log(arr)
  return arr

}