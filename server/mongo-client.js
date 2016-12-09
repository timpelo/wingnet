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
            if (err != null) {
               callback({
                  "success": "false",
                  "message": err
               });
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
            if (err != null) {
               callback({
                  "success": "false",
                  "message": err
               });
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
         if (filter._id != undefined) {
            filter._id = ObjectID(filter._id);
         }
         if (filter.userid != undefined) {
            if (filter.userid.$ne != undefined) {
               filter.userid.$ne = ObjectID(filter.userid.$ne);
            }
         }
         collection.find(filter).toArray(function(err, result) {
            if (err != null) {
               callback({
                  "success": "false",
                  "message": err
               });
            } else {
               callback(result);
            }
            db.close();
         });
      });
   }

   function getProfileWithUserId(userid, callback) {
      MongoClient.connect(url, function(err, db) {
         var collection = db.collection(profilesCollection);
         collection.findOne({
            userid: ObjectID(userid)
         }, function(err, result) {
            if (err != null) {
               callback({
                  "success": false,
                  "message": err
               });
            } else if (result == null) {
               callback({
                  "success": false,
                  "message": "No profile found"
               });
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
            if (err != null) {
               callback({
                  "success": "false",
                  "message": err
               });
            } else {
               callback(result);
            }
            db.close();
         });
      });
   }

   function getRequests(profileId, inOut, callback) {
      MongoClient.connect(url, function(err, db) {
         var collection = db.collection(requestCollection);

         var filter = {};
         if (inOut == "IN") {
            filter.to = profileId;
         } else if (inOut == "OUT") {
            filter.from = profileId;
         }
         collection.find(filter).toArray(function(err, result) {
            if (err != null) {
               callback({
                  "success": "false",
                  "message": err
               });
            } else {
               fillRequestInfo(result, inOut, callback);
            }
            db.close();
         });
      });
   }

   function checkRequest(filter, callback) {
      MongoClient.connect(url, function(err, db) {
         var collection = db.collection(requestCollection);
         collection.find(filter).toArray(function(err, result) {
            if (err != null) {
               callback({
                  "success": "false",
                  "message": err
               });
            } else {
               callback(result);
            }
            db.close();
         });
      });
   }

   function addRequest(request, callback) {
      MongoClient.connect(url, function(err, db) {
         var collection = db.collection(requestCollection);
         collection.insertOne(request, function(err, result) {
            if (err != null) {
               callback({
                  "success": "false",
                  "message": err
               });
            } else {
               callback(result);
            }
            db.close();
         });
      });
   }

   function removeRequest(requestId, callback) {
      MongoClient.connect(url, function(err, db) {
         var collection = db.collection(requestCollection);
         collection.remove({
            _id: ObjectID(requestId)
         }, function(err, result) {
            if (err != null) {
               callback({
                  "success": "false",
                  "message": err
               });
            } else {
               callback(result);
            }
            db.close();
         });
      });
   }

   function updateRequest(request, callback) {
      MongoClient.connect(url, function(err, db) {
         var collection = db.collection(profilesCollection);
         var o_id = ObjectID(request._id);
         delete request._id;
         collection.update({
            _id: o_id
         }, request, function(err, result) {
            if (err != null) {
               callback({
                  "success": "false",
                  "message": err
               });
            } else {
               callback(result);
            }
            db.close();
         });
      });
   }

   function updateProfile(profile, callback) {
      MongoClient.connect(url, function(err, db) {
         var collection = db.collection(profilesCollection);
         var o_id = ObjectID(profile._id);
         profile.userid = ObjectID(profile.userid);
         delete profile._id;
         collection.update({
            _id: o_id
         }, profile, function(err, result) {
            if (err != null) {
               callback({
                  "success": "false",
                  "message": err
               });
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
         collection.find({}).sort({
            "id": -1
         }).limit(1).toArray(function(err, result) {
            if (result.length > 0) {
               callback(result[0].id);
            } else {
               callback(0);
            }
            db.close();
         });
      });
   }

   function fillRequestInfo(inResult, inOut, callback) {
      var ids = [];
      if (inOut == "IN") {
         ids = inResult.map(function(a) {
            return {
               _id: ObjectID(a.from)
            }
         });
      } else if (inOut == "OUT") {
         ids = inResult.map(function(a) {
            return {
               _id: ObjectID(a.to)
            }
         });
      }

      var filter = {
         $or: ids
      };
      getProfiles(filter, fillMethod);

      function fillMethod(fillInfo) {
         for (var i = 0; i < inResult.length; i++) {
            for (var j = 0; j < fillInfo.length; j++) {
               if (inOut == "IN") {
                  if (fillInfo[j]._id == inResult[i].from) {
                     inResult[i].fromName = fillInfo[j].name;
                     inResult[i].interest = fillInfo[j].interest;
                     inResult[i].platform = fillInfo[j].platform;
                  }
               } else if (inOut == "OUT") {
                  if (fillInfo[j]._id == inResult[i].to) {
                     inResult[i].toName = fillInfo[j].name;
                     inResult[i].interest = fillInfo[j].interest;
                     inResult[i].platform = fillInfo[j].platform;
                  }
               }
            }
         }
         callback(inResult);
      }
   }

   exports.getProfiles = getProfiles;
   exports.addProfile = addProfile;
   exports.getRequests = getRequests;
   exports.checkRequest = checkRequest;
   exports.addRequest = addRequest;
   exports.register = register;
   exports.getUser = getUser;
   exports.updateProfile = updateProfile;
   exports.getProfileWithUserId = getProfileWithUserId;
   exports.removeRequest = removeRequest;
   exports.updateRequest = updateRequest;
}())
