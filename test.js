//------------
// array describes the tests
var server_addr = "http://127.0.0.1:8080/";
var address_tests = [];
address_tests.push({
    address: server_addr,
    response: null // check only 200 status code
});

address_tests.push({
    address: server_addr + "notAdate",
    response: {unix: null, natural: null}
});

address_tests.push({
    address: server_addr + "1450137600",
    response: {unix: 1450137600, natural: new Date("Tue Dec 15 2015")}
});

address_tests.push({
    address: server_addr + "December%2015,%202015",
    response: {"unix": 1450137600, "natural": new Date("Tue Dec 15 2015")}
});

//--------------
// Do tests
var http = require('http');
var bl = require('bl');
//var server = require("index");


address_tests.forEach((test_item, index, array) =>{
    http.get(test_item.address, (res) => {
        if(res.statusCode != 200){
            console.log(`Test: ${test_item.address}. Got error response: ${res.statusCode}`);
            process.exit(-1);
        }
        else if(test_item.response != null){
            res.pipe(bl((err, data) => {
                if(err){
                    console.log(err);
                    process.exit(-3);
                }
                var resp_obj = JSON.parse(data);
                if(!("unix" in resp_obj) || !("natural" in resp_obj)){
                    console.log(`Test: ${test_item.address}. Get: ${data}. Test: ${JSON.stringify(test_item.response)}`);
                    process.exit(-4);
                }
                if(resp_obj.unix != test_item.response.unix){
                    console.log(`Test: ${test_item.address}. Get: ${data}. Test: ${JSON.stringify(test_item.response)}`);
                    process.exit(-4);
                }
                if(test_item.response.natural == null){
                    if(resp_obj.natural != null){
                        console.log(`Test: ${test_item.address}. Get: ${data}. Test: ${JSON.stringify(test_item.response)}`);
                        process.exit(-4);
                    }
                }
                else if(Date.parse(resp_obj.natural) != Date.parse(test_item.response.natural)){
                    console.log(`Test: ${test_item.address}. Get: ${data}. Test: ${JSON.stringify(test_item.response)}`);
                    process.exit(-4);
                }
            }));
        }
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
        process.exit(-2);
    });
});


