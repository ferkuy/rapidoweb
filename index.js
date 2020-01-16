var mongoose = require('mongoose');
var app = require("./app");
var port = process.env.port || 8080;
app.listen(80, function(){
    console.log("API REST runing in http://localhost:" + port);
});
