var kue = require('kue');
var queue = kue.createQueue();
var async = require('async');
var MongoClient = require('mongodb').MongoClient;

var MONGODB_URL = process.env['ERRAND_MONGODB_URL'] ? process.env['ERRAND_MONGODB_URL'] : "mongodb://localhost:27017";

function graceful() {
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

queue.process('errand-mongodb', function(job, done){

  MongoClient.connect( MONGODB_URL + "/" + job.data.request.database, function(err, db) {  	

    var collection = db.collection( job.data.request.collection );
    collection.aggregate( 
  	  job.data.request.parameters.pipeline,	  
      function(err, results) {
        db.close();
        done();
      }
    );

  });

});
