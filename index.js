/*User Story: I can pass a string as a parameter, and it will check to see whether that string contains
    either a unix timestamp or a natural language date (example: January 1, 2016).

User Story: If it does, it returns both the Unix timestamp and the natural language form of that date.

User Story: If it does not contain a date or Unix timestamp, it returns null for those properties.*/

var port;
if(process.argv.length < 3){
    port = 8080;
}
else port = process.argv[2];

const express = require("express");
const path = require("path");

const app = express();

function get_json_time(strtime){
    var unix = null;
    var natural = null;
    var timestamp = Number(strtime) *1000;
    
    if(isNaN(timestamp)){
        timestamp = Date.parse(strtime);
    }
    
    if(!isNaN(timestamp)){
        var d = new Date(timestamp);
        unix = d.getTime()/1000;
        natural = d.toDateString(); 
    }
    
    return {
      unix: unix,  
      natural: natural
      };
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/:timestamp', (req, res) => {
    res.send(JSON.stringify(get_json_time(req.params.timestamp)));
});

app.listen(port);