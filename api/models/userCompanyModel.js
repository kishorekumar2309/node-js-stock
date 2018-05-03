var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  full_name: { type: String, required: true },
  user_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  favourite_companies: [{ type: String, required: true }]
});

var CompanySchema = new Schema({
    company_name: { type: String, required: true },
    company_symbol: { type: String, required: true },
    bayesian_prediction: {type: Number, required: true },
    svm_prediction: {type: Number, required: true },
    lstm_live_prediction: {type: Number, required: true },
    lstm_daily_prediction: {type: Number, required: true },
    indicator_image: { type: String, required: true },
    twitter_sentimental_prediction: { type: String, required: true }
});

var User = mongoose.model('Users', UserSchema);
var Company = mongoose.model('Companies', CompanySchema);

module.exports = {
    User,
    Company
}