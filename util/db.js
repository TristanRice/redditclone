const MongoClient = require("mongodb").MongoClient
	, config 	  = require("../config"); 

module.exports = (callback) => {
	MongoClient.connect(config.MongoURI, callback);
}