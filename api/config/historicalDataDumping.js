var request = require('request');
var rp = require('request-promise');
var mongoose = require('mongoose');

var companies = ['TWTR','AMZN', 'GOOG', 'MSFT', 'AAPL', 'FB', 'NVDA', 'WMT', 'TGT', 'SAP'];
var urlRequests = [];

function createURL(){
    for(let i=0; i<companies.length; i++){
        let temp = {
            uri: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+companies[i]+'&outputsize=full&datatype=json&apikey=67M5HDM0P13NRL8A',
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        }
        urlRequests.push(temp);
        //console.log(urlRequests);
    }
    return urlRequests;
}


function queryExecutor(url, modelTemplate){
    rp(url)
        .then(function (result) {
            let metadata = result['Meta Data'];
            let data = result['Time Series (Daily)'];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let oneDay = new modelTemplate();
                    oneDay.company = metadata['2. Symbol'];
                    oneDay.date = key;
                    let details = data[key];
                    oneDay.open = details['1. open'];
                    oneDay.high = details['2. high'];
                    oneDay.low = details['3. low'];
                    oneDay.close = details['4. close'];
                    oneDay.volume = details['5. volume'];
                    oneDay.save()
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