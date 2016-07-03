/*User Story: I can pass a string as a parameter, and it will check to see whether that string contains
    either a unix timestamp or a natural language date (example: January 1, 2016).

User Story: If it does, it returns both the Unix timestamp and the natural language form of that date.

User Story: If it does not contain a date or Unix timestamp, it returns null for those properties.*/


if(process.argv.length < 3){
    console.log("Use: " + __filename + ": port");
    return;
}

const express = require("express");

const app = express();

function get_json_time(timestamp){
    var unix = null;
    var natural = null;
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

app.get('/:timestamp', (req, res) => {
    var timestamp = Number(req.params.timestamp) *1000;
    res.send(JSON.stringify(get_json_time(timestamp)));
});

app.listen(process.argv[2]);