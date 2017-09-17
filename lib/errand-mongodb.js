var kue = require('kue');
var queue = kue.createQueue();
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var _ = require('underscore');


var MONGODB_URL = process.env['ERRAND_MONGODB_URL'] ? process.env['ERRAND_MONGODB_URL'] : "mongodb://localhost:27017";

function graceful() {
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

function helpers(request, options) {
  _.each(options, function(option) {
    _.each( option, function( val, key ) {

      switch(val) {

        case "lastday":
          request.unshift({$match:{[key]: {$lt: new Date(moment().add(-1, 'days').endOf('day'))}}});
          request.unshift({$match:{[key]: {$gt: new Date(moment().add(-1, 'days').startOf('day'))}}});
          break;

          case "lastweek":
            request.unshift({$match:{[key]: {$lt: new Date(moment().add(-1, 'days').endOf('day'))}}});
            request.unshift({$match:{[key]: {$gt: new Date(moment().add(-8, 'days').startOf('day'))}}});
            break;
      }

    });
  });

  return (request);
}

queue.process('errand-mongodb', function(job, done){

  switch(job.data.request.method) {

    case 'db.collection.aggregate':

      MongoClient.connect( MONGODB_URL + "/" + job.data.request.parameters.database, function(err, db) {

      var collection = db.collection( job.data.request.parameters.collection );

      collection.aggregate(
  	    helpers(job.data.request.parameters.pipeline, job.data.request.parameters.helpers),
          function(err, results) {
            db.close();
            done();
          }
        );

      });

      break;

  }


});
