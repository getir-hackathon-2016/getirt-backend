var mongodb = require('mongodb'),
dbUrl = "mongodb://localhost:27017/getirtdb",
MongoClient = mongodb.MongoClient,
ObjectID = require('mongodb').ObjectID;

module.exports.MongoClient=MongoClient;
module.exports.dbUrl=dbUrl;
module.exports.mongodb=mongodb;
module.exports.ObjectID=ObjectID;