var fs = require('fs')
var readline = require('readline')

var data = fs.readFile('nn-adaptors.json','utf8', function(err,data) {
  if (err != null) {
    console.log(err)
  } else {
    console.log('This is an adaptor interface:')
    console.log('You can \'create\', \'edit\', and \'show\' attributes of the following adaptor object.')

    var adaptor = JSON.parse(data)
    setTimeout(print,1000,adaptor)

    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    setTimeout(print,3000,'EX: \'show A16[0]\' --> {e_num: 1, adaptorVals: [Object] }\nNote -- if you want to edit an attribute, you must specify the attribute itself, not the parent')
    
    setTimeout(prompt,5000,rl,adaptor,'\nType \'exit\' to end. \n\nInput: ')
    //rl.close()
  }
})

function prompt(rl,adaptor,text) {
  
  rl.question(text, (answer) => {
    run(answer, rl, adaptor)
  });
}

function print (val) {
  console.log(val)
}

function run(answer, rl, adaptor) {
  var keys = ['create','edit','show','exit','delete','sort','trace','fill']
  answer = answer.split(' ')
  var kIndex;
  var aIndex;
  kIndex = search(answer, keys)
  if (kIndex == -1) {
    return prompt(rl, adaptor, '\nYou did not enter any proper keywords. \n\nInput: ')
  } else {
    if (keys[kIndex] == 'exit') {
      rl.close()
      return null
    } else if (keys[kIndex] == 'show') { //showing properties
      var show = answer.shift()
      if (eval('adaptor.' + show) != null) {
        console.log('\n' + adaptor[show])
        return prompt(rl, adaptor, '\nDisplayed elements\n\nInput: ')
      }
      return prompt(rl, adaptor, '\nshow <adaptor_name>.<property>\n\nInput: ')
    } else if (keys[kIndex] == 'create') { //creating adaptors
      if (answer.length < 4) {
        return prompt(rl, adaptor, '\nNot enough attributes provided\ncreate <adaptor_name> <adaptor_length> <a_val> <ordering> ... <a_val> <ordering> --note ordering currently has 3 possible values: \'normal\',\'reverse\',\'custom\'\n\nInput: ')   
      } else {
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
        return prompt(rl, adaptor, '\nAdaptor generating has not been implemented yet\n\nInput: ')  
         
      }
    } else if (keys[kIndex] == 'edit') { //editing properties
      var edit = answer.shift()
      if (eval('adaptor.' + edit) != null) {
        if (answer.length == 0) {
          return prompt(rl, adaptor, '\nNot enough attributes provided\nedit <adaptor_name>.<property> <new_value> \n\nInput: ')
        } else if (answer.length == 1) {
          eval('adaptor.' + edit + '  == ' + answer.shift())
          console.log(console.log('\n' + JSON.stringify(eval('adaptor.' + edit), null, 2)))
          return prompt(rl, adaptor, '\nAttribute modified. \n\nInput: ')
        } else {
          return prompt(rl, adaptor, '\nToo many arguments\n\nInput: ')
        }
      } else {
        return prompt(rl, adaptor, '\nNot enough attributes provided\nedit <adaptor_name>.<property> <new_value> \n\nInput: ')
      }
    } else if (keys[kIndex] == 'delete') { //deleting adaptors
      if (answer.length == 0) {
        return prompt(rl, adaptor, '\nNo attributes provided\ndelete <adaptor_name> \n\nInput: ')
      } else if (answer.length == 1) {
        var del = answer.shift()
        if (eval('adaptor.' + del) != null) {
          eval('delete adaptor.' + del)
          fs.writeFileSync('nn-adaptors.JSON',JSON.stringify(adaptor, null, 2),'utf8')
          return prompt(rl, adaptor, '\nAdaptor deleted\n\nInput: ')
        } else {          
          return prompt(rl, adaptor, '\nInvalid property\n\nInput: ')
        }
      } else {
        return prompt(rl, adaptor, '\nToo many arguments\n\nInput: ')
      }
    } else if (keys[kIndex] == 'sort') { //sorting an adaptor by a property
      if (answer.length < 3) {
        return prompt(rl, adaptor, '\nNot enough attributes provided\nsort <adaptor_name> by <property>\n\nInput: ')
      } else {
        if (adaptor.answer[0] == null) {
          return prompt(rl, adaptor, '\nIncorrect adaptor name\n\nInput: ')
        } else if (adaptor[answer[0]][0][answer[2]] == null) {
          return prompt(rl, adaptor, '\nIncorrect property\n\nInput: ')
        } else {
          return prompt(rl, adaptor, '\nSorting not implemented yet\n\nInput: ')
        }
      }
    } else if (keys[kIndex] == 'trace') { //tracing an adaptor
      if (answer.length < 3) {
        return prompt(rl, adaptor, '\ntrace <adaptor_name> <position> <final_adaptor>\n\nInput: ')
      } else {
        if (adaptor[answer[0]] != null && adaptor[answer[0]].length > answer[1]) {
          var e = adaptor[answer[0]][answer[1]]
          if (e.a_vals[answer[2]] == null) {
            return prompt(rl, adaptor, '\ninvalid final adaptor\n\nInput: ')
          } else {
            return prompt(rl, adaptor, '\nThe trace from position ' + answer[1] + ' of adaptor ' + answer[0] + ' to ' + answer[2] + ':\n\npos: ' + e.pos + ' --> ' + e.a_vals[answer[2]].pos + '\n\ne_num: ' + e.e_num + ' --> ' + e.a_vals[answer[2]].e_num + '\n\nInput: ')
          }
        } else {
          return prompt(rl, adaptor, '\ninvalid attributes\n\nInput: ')
        }
      }
    } else if (keys[kIndex] == 'fill') { //filling an adaptor property's contents
      if (answer.length < 2) {
        return prompt(rl, adaptor, '\nfill <adaptor_name> <property> <input_options> -- reverse or normal -- file used is \'raw-interface-data.txt\'\n\nInput: ')        
      } else if (eval('adaptor.' + answer[0] + '[0].' + answer[1]) == null) {
        return prompt(rl, adaptor, '\ninvalid attributes\n\nInput: ')
      } else {
        var rd = fs.readFileSync('raw-interface-data.txt','utf8')
        rd = rd.split(' ')
        if (rd.length != adaptor[answer[0]].length) {
          return prompt(rl, adaptor, '\nData is incomplete\'\n\nInput: ')
        } else {
          console.log(answer[2])
          if (answer[2] == 'reverse') {
            rd = rd.reverse()
            console.log('reversed')
          }
          for (var ii = 0; ii < rd.length; ii++) {
            adaptor[answer[0]][ii][answer[1]] = rd[ii]
          }
          fs.writeFileSync('nn-adaptors.JSON',JSON.stringify(adaptor, null, 2),'utf8')
          return prompt(rl, adaptor, '\nAdaptor filled\n\nInput: ')
        }
      }
    }
  }
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