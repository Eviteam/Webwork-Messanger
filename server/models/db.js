const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const connectionOptions = { 
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const connect = mongoose.connect('mongodb://localhost:27017/Chat', connectionOptions);

module.exports = connect;