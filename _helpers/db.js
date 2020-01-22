const config = require("../config");
const mongoose = require("mongoose");
mongoose.set('debug', true);
mongoose.connect(config.connectionString, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(  
  () => {console.log('Database is connected') },  
  err => { console.log('Can not connect to the database'+ err)}  
); 
mongoose.Promise = global.Promise;

module.exports = {
  User: require("../users/user.model")
};