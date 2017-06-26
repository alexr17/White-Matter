var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

url = '';

request(url, function(error, response, html){
    if(!error){
        var $ = cheerio.load(html);

        var x, y, z;
        var json = { x : "", y : "", z : ""};

        //using jquery syntax
        $('.header').filter(function(){
            var data = $(this);
            //do stuff with the data

            json.x = 'stuff here'
        })

        $('body').filter(function(){
            var data = $(this);
            //do more stuff with the data

            json.y = 'more stuff';
        })
    }

    // To write to the system we will use the built in 'fs' library.
    // In this example we will pass 3 parameters to the writeFile function
    // Parameter 1 :  output.json - this is what the created filename will be called
    // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
    // Parameter 3 :  callback function - a callback function to let us know the status of our function

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

        console.log('File successfully written! - Check the directory for the output.json file');

    })
});