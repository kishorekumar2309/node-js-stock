var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cron = require('node-cron');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Stockdb'); 

var User = require('./api/models/userCompanyModel').User;
var Company = require('./api/models/userCompanyModel').Company;
// var HistoricalData = require('./api/models/historicalDataModel');
// var LiveData = require('./api/models/liveDataModel');
var GoogleData = require('./api/models/historicalDataModel/googleHistoricalData');
var AppleData = require('./api/models/historicalDataModel/appleHistoricalData');
var AmazonData = require('./api/models/historicalDataModel/amazonHistoricalData');
var MicrosoftData = require('./api/models/historicalDataModel/microsoftHistoricalData');
var SapData = require('./api/models/historicalDataModel/sapHistoricalData');
var FacebookData = require('./api/models/historicalDataModel/facebookHistoricalData');
var NvidiaData = require('./api/models/historicalDataModel/nvidiaHistoricalData');
var WalmartData = require('./api/models/historicalDataModel/walmartHistoricalData');
var TargetData = require('./api/models/historicalDataModel/targetHistoricalData');
var TwitterData = require('./api/models/historicalDataModel/twittrerHistoricalData');

var GoogleLiveData = require('./api/models/liveDataModel/googleLiveData');
var AppleLiveData = require('./api/models/liveDataModel/appleLiveData');
var AmazonLiveData = require('./api/models/liveDataModel/amazonLiveData');
var MicrosoftLiveData = require('./api/models/liveDataModel/microsoftLiveData');
var SapLiveData = require('./api/models/liveDataModel/sapLiveData');
var FacebookLiveData = require('./api/models/liveDataModel/facebookLiveData');
var NvidiaLiveData = require('./api/models/liveDataModel/nvidiaLiveData');
var WalmartLiveData = require('./api/models/liveDataModel/walmartLiveData');
var TargetLiveData = require('./api/models/liveDataModel/targetLiveData');
var TwitterLiveData = require('./api/models/liveDataModel/twitterLiveData');

var HistoricalDataDumpers = [TwitterData, AmazonData, GoogleData, MicrosoftData, AppleData, FacebookData, NvidiaData, WalmartData, TargetData, SapData];
var LiveDataDumpers = [TwitterLiveData, AmazonLiveData, GoogleLiveData, MicrosoftLiveData, AppleLiveData, FacebookLiveData, NvidiaLiveData, WalmartLiveData, TargetLiveData, SapLiveData];

var historicalDataDump = require('./api/config/historicalDataDumping');
var historicalUrls = historicalDataDump.createURL();
cron.schedule('* 17 * * 1-5', function(){
  for (let index = 0; index < historicalUrls.length; index++) {
    historicalDataDump.queryExecutor(historicalUrls[index], HistoricalDataDumpers[index]);
  }
});

var liveDataDump = require('./api/config/liveDataDumping');
var liveUrls = liveDataDump.createURL();
cron.schedule('* 9-16 * * 1-5', function(){
  for (let index = 0; index < historicalUrls.length; index++) {
    liveDataDump.queryExecutor(liveUrls[index], LiveDataDumpers[index]);
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/stockRoute'); //importing route
routes(app); //register the route

app.listen(port);

console.log('Stock predictor RESTful API server started on: ' + port);