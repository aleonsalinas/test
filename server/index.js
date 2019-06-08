// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import cors
var cors = require('cors')
// Import Mongoose
let mongoose = require('mongoose');
// Initialize the app
let app = express();
// Import routes
let apiRoutes = require("./api-routes")
// Import Reuest
var request = require('request');
// Import feed controller
var feedController = require('./feedController');
// Scheduling Jobs
var schedule = require('node-schedule');

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(bodyParser.json());
// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/db_test',{ useNewUrlParser: true });
var db = mongoose.connection;
// Setup server port
var port = process.env.PORT || 8080;
// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));
// Use Api routes in the App
app.use('/api', apiRoutes);

// Once an hour retrieve data from api
var rule = new schedule.RecurrenceRule();
rule.minute = 0;
rule.second = 0;

var retrieveData = request('https://hn.algolia.com/api/v1/search_by_date?query=nodejs', function (error, response, body) {
  console.log("Retrieving Data from Algolia...");  
  if (!error && response.statusCode == 200) {
    var importedJSON = JSON.parse(body);
  
    importedJSON.hits.forEach(function(element) {
        var obj = { "body": element};   
        feedController.new(obj,undefined);
    }); 
    console.log("Data retrieved");
  }
  else{
    console.log("Data could not be retrieved");
  }
  
});
//Schedule a job to do this request every hour  
schedule.scheduleJob(rule, function(){
  retrieveData
}); 

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running Reign Design on port " + port);
});