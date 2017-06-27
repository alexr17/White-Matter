var fs = require('fs');
var request = require('request');
//var cheerio = require('cheerio');
var async = require('async');

var file_path = '/Users/Alex/Desktop/WhiteMatterSummer2017/ProbesData/neuronexus/'

var fileNames = []
var rawData = []


function directory (file_path) {
    //all the reading functions here that get the data and send it along
    //this gets the all the file names
    if (process.argv.length <= 2) {
        console.log("Usage: " + __filename + file_path);
        process.exit(-1);
    }
    var path = process.argv[2];
    fs.readdir(path, function(err, items) {
        fileNames = items //now have the file names
        //console.log(fileNames) 
        
        async.each(fileNames, function (file, callback) { //go through each file and extract
            var data = fs.readFileSync(file_path + file, 'utf8')
            rawData.push(data)
            callback();

        }, function(err) { //now the data is set
            //now parse
            for (var ii = 0; ii < rawData.length; ii++) {
                //console.log(rawData[ii])
                rawData[ii] = parse(rawData[ii])
                //console.log(rawData[ii])
            }
            fileNames = fileNames.map(function(e){
                return e.replace('.prb','')
            })
            write(fileNames, 'File_Names.txt')
        })
    })
}

function parse (data) { //parse the data
    data = data.replace(/(\\r\\n| |\n|\r)/g,"") //white space and newlines line feeds etc
    data = data.match(/(?:'geometry':{(.)+?\)})/g,"") //identifying the geometric points (only thing we want rn)
    data = data.map(function(e) {
        e = e.replace(/(\'geometry\':{)|(})/g,"")
        //console.log(e)
        return e
    }) //getting rid of the geometric stuff
    //console.log(data)
    return data
}

function write (array, file) {
    fs.writeFileSync(file, array, 'utf8')
}

directory(file_path)




//let's say for now that rawData possesses the correct configuration and we now need to put 

/*
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
*/