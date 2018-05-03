var mongoose = require('mongoose');
var Company = require('../models/userCompanyModel').Company;
var User = require('../models/userCompanyModel').User;
var History = require('../models/historicalDataModel');
var Live = require('../models/liveDataModel');

var GoogleLiveData = require('../models/liveDataModel/googleLiveData');
var AppleLiveData = require('../models/liveDataModel/appleLiveData');
var AmazonLiveData = require('../models/liveDataModel/amazonLiveData');
var MicrosoftLiveData = require('../models/liveDataModel/microsoftLiveData');
var SapLiveData = require('../models/liveDataModel/sapLiveData');
var FacebookLiveData = require('../models/liveDataModel/facebookLiveData');
var NvidiaLiveData = require('../models/liveDataModel/nvidiaLiveData');
var WalmartLiveData = require('../models/liveDataModel/walmartLiveData');
var TargetLiveData = require('../models/liveDataModel/targetLiveData');
var TwitterLiveData = require('../models/liveDataModel/twitterLiveData');

var LiveDataDumpers = [TwitterLiveData, AmazonLiveData, GoogleLiveData, MicrosoftLiveData, AppleLiveData, FacebookLiveData, NvidiaLiveData, WalmartLiveData, TargetLiveData, SapLiveData];

var liveDataDictionary = {
    'GOOG': GoogleLiveData,
    'AAPL': AppleLiveData,
    'AMZN': AmazonLiveData,
    'MSFT': MicrosoftLiveData,
    'SAP': SapLiveData,
    'FB': FacebookLiveData,
    'NVDA': NvidiaLiveData,
    'WMT': WalmartLiveData,
    'TGT': TargetLiveData,
    'TWTR': TwitterLiveData
};

exports.create_company = function(req, res) {
    var new_company = new Company(req.body);
    new_company.save(function(err, company) {
        if (err)
            res.send(err);
        res.json(company);
    });
};

exports.company_info = function(req, res) {
    Company.find({}, function(err, company) {
        if (err)
            res.send(err);
        res.json(company);
    });
};

exports.create_user = function(req, res) {
    var new_user = new User(req.body);
    new_user.save(function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};

exports.user_info = async (req, res, next) => {
    var user = await User.find({email: req.body.email});
    var companyList =  user[0]["favourite_companies"];
    for (let index = 0; index < companyList.length; index++) {
        user[0]["favourite_companies"][index] = await Company.find({company_symbol: companyList[index]});
    }
    res.json(user);
};

exports.historical_stock_info = function(req, res) {
    History.find({company: "AMZN"})
        .limit(1)
        .exec(function(err, stocks) {
            res.json(stocks);
        });
};

exports.live_stock_last_minute_info = function(req, res) {
    var index = 0;
    lastMinuteValues = {};
    function valueUpdater() {
        if(index == LiveDataDumpers.length) {
            valueReturn();
            return;
        };
        LiveDataDumpers[index].find()
        .sort({date: -1})
        .limit(1)
        .exec(function(err, stocks) {
            lastMinuteValues[stocks[0]["company"]] = stocks;
            index++;
            valueUpdater();
        });
    }
    valueUpdater();
    function valueReturn(){
         res.json(lastMinuteValues);
    }
}

exports.add_user_companies = async (req, res, next) => {
    let newCompanyList = req.body.favourite_companies;
    /*
    let companyList =  user[0]["favourite_companies"];
    companyList.push.apply(companyList, newCompanyList);
    console.log(companyList[0] instanceof mongoose.Types.ObjectId);
    companyList = removeDuplicates(companyList, )
    console.log(companyList);
    */
    User.update({email: req.body.email},  {$addToSet: {favourite_companies: newCompanyList}}, function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
    /*for (let index = 0; index < companyList.length; index++) {
        user[0]["favourite_companies"][index] = companyList[index];
    }*/
};

exports.delete_user_companies = function (req, res) {
    let deleteFavouriteCompany = req.body.favourite_company;
    User.findOne({email: req.body.email}, function(err, user){
        let companyList = user["favourite_companies"];
        for(var i=0; i<companyList.length; i++){
            if (companyList[i] == deleteFavouriteCompany){
                console.log(companyList[i]);
                user["favourite_companies"].remove(companyList[i]);
                break;                          
            }
        }
        user.save(function(err,user){
            res.json(user);
        });     
    });    
};

exports.live_stock_for_company = function (req, res) {
    let companySymbol = req.body.company_symbol;
    //console.log(liveDataDictionary[companySymbol]);
    
    liveDataDictionary[companySymbol].find({})
        .sort({data: -1})
        .limit(500)
        .exec(function(err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
}

/*function removeDuplicates(myArr, prop) {
     return myArr.filter((obj, pos, arr) => {
         return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
     });
}*/




