jest.setTimeout(30000);

require('../models/User.js');

const mongoose = require('mongoose');
const keys = require('../config/keys.js');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {useMongoClient: true});
