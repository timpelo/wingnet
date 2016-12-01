(function() {
  "use strict";

  var MongoClient = require('mongodb').MongoClient;
  var ObjectID = require('mongodb').ObjectID;
  var url = "mongodb://localhost:27017/wingnet";
  var profilesCollection = "profiles";
  var requestCollection = "requests";
  var userCollection = "users";

  /* List functions */

  function register(user, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(userCollection);
      collection.insertOne(user, function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          callback(result);
        }
        db.close();
      });
   });
  }

  function getUser(filter, callback) {
     MongoClient.connect(url, function(err, db) {
       var collection = db.collection(userCollection);
       collection.findOne(filter, function(err, result) {
          if(err != null) {
            callback({"success" : "false", "message":err});
          } else {
            callback(result);
          }
          db.close();
       });
     });
  }

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
          callback({"success" : "true", "message":result});
        }
        db.close();
      });
    });
  }

  function getRequests(profileId, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(requestCollection);

      var filter = {to: profileId};
      collection.find(filter).toArray(function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          fillRequestInfo(result, callback);
        }
        db.close();
      });
    })
  }

  function updateProfile(profile, callback) {
     MongoClient.connect(url, function(err, db) {
      var collection = db.collection(profilesCollection);
      collection.update({_id:profile._id}, {$set:profile}, function(err, result) {
         if(err != null) {
          callback({"success" : "false", "message":err});
         } else {
          callback({"success" : "true", "message":result});
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

  function fillRequestInfo(inResult, callback) {

     // Get list of profile Ids
     var fromIds = inResult.map(function(a) {return {_id : ObjectID(a.from)}});

     var filter = {$or : fromIds};
     getProfiles(filter, fillMethod);

     function fillMethod(fillInfo) {
        for(var i = 0;  i < inResult.length; i++) {
           for (var j = 0; j < fillInfo.length; j++) {
             if(fillInfo[j]._id == inResult[i].from) {
                inResult[i].fromName = fillInfo[j].name;
                inResult[i].interests = fillInfo[j].interest;
                inResult[i].platform = fillInfo[j].platform;
             }
          }
        }
        callback(inResult);
     }
  }

  exports.getProfiles = getProfiles;
  exports.addProfile = addProfile;
  exports.getRequests = getRequests;
  exports.register = register;
  exports.getUser = getUser;
  exports.updateProfile = updateProfile;
}())
