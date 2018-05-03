var request = require('request');
var rp = require('request-promise');
var mongoose = require('mongoose');
//var CurrentData = mongoose.model('Currents');

var companies = ['TWTR','AMZN', 'GOOG', 'MSFT', 'AAPL', 'FB', 'NVDA', 'WMT', 'TGT', 'SAP'];

var urlRequests = [];

function createURL(){
    for(let i=0; i<companies.length; i++){
        let temp = {
            uri: 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+companies[i]+'&interval=1min&outputsize=compact&datatype=json&apikey=67M5HDM0P13NRL8A',
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        }
        urlRequests.push(temp);
    }
    return urlRequests;
}

function queryExecutor(url, liveModelTemplate){
    rp(url)
        .then(function (result) {
            let metadata = result['Meta Data'];
            let data = result['Time Series (1min)'];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let oneMinute = new liveModelTemplate();
                    oneMinute.company = metadata['2. Symbol'];
                    oneMinute.date = key;
                    let details = data[key];
                    oneMinute.open = details['1. open'];
                    oneMinute.high = details['2. high'];
                    oneMinute.low = details['3. low'];
                    oneMinute.close = details['4. close'];
                    oneMinute.volume = details['5. volume'];
                    oneMinute.save()
                        .catch(function (err) {
                            console.log("Data already present");
                        });
                }
            }
        })
        .catch(function (err) {
            console.log(err);
            console.log('API is currently getting updated');
        });   
}

module.exports= {
    createURL, queryExecutor
}

//queryExecutor(urlRequests);