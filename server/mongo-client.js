(function() {
  "use strict";

  var MongoClient = require('mongodb').MongoClient
  var url = "mongodb://localhost:27017/test";
  var profilesCollection = "profiles";

  /* List functions */
  function getProfiles(filter, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(profilesCollection);
      collection.find(filter).toArray(function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          callback(result);
        }
        db.close();
      });
    });
  }

  function addProfile(profile, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(profilesCollection);
      collection.insertOne(profile, function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          callback(result);
        }
        db.close();
      });
    });
  }

  /* Utils */
  function getLastId(collectionName, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(collectionName);
      collection.find({}).sort({"id":-1}).limit(1).toArray(function(err, result) {
        if(result.length > 0) {
          callback(result[0].id);
        } else {
          callback(0);
        }
        db.close();
      });
    });
  }

  exports.getProfiles = getProfiles;
  exports.addProfile = addProfile;
}())
