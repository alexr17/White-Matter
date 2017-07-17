var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('exe.txt')
});

lineReader.on('line', function (line) {
  if (line.includes('db')) {
    console.log(line.replace(/\?/g,''));
  }

});