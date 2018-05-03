module.exports = function(app) {
    var stock = require('../controllers/stockController');

    // stock Routes
    //All company resources
    app.route('/company-info')
        .get(stock.company_info);
    
    //Create company resource
    app.route('/create-company')
        .post(stock.create_company);

    //Fetch user resource - Pass email
    app.route('/user-info')
        .post(stock.user_info);
    
    //Create user resource
    app.route('/create-user')    
        .post(stock.create_user);

    //Add Favourite companies for users - Pass email ID and company IDs
    app.route('/add-user-company')
        .post(stock.add_user_companies);

    //Remove Favourite companies for users - Pass email ID and company IDs
    app.route('/delete-user-company')
        .post(stock.delete_user_companies);

    app.route('/historical-all')
        .get(stock.historical_stock_info);

    app.route('/last-minute-stocks')
        .get(stock.live_stock_last_minute_info);

    app.route('/live-data-company')
        .post(stock.live_stock_for_company);
};
  