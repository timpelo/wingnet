var mongo = require('../mongo-client');
var sjcl = require('sjcl');
var jwt = require('jsonwebtoken');


//TODO: Get from conf file!
var encodePw = "dotamasterraceblizzardsucks";
var superSecret = "ilovedotadotaisthebest";

exports.profiles = function(req, res) {
   var filter = req.body.filters;
   if (filter != null && filter != undefined) {
      mongo.getProfiles(filter, function(result) {
         if (result.success != false) {
            res.json({
               success: true,
               data: result
            });
         } else {
            res.json(result);
         }
      });
   }
};

exports.add = function(req, res) {
   var profile = req.body.profile;

   if (profile != null && profile != undefined) {
      mongo.getProfiles({
         name: profile.name
      }, function(result) {
         if (result.success != false && result.data.length ==
            0) {
            mongo.addProfile(profile, function(result) {
               if (result.success != false) {
                  res.json({
                     success: true,
                     data: result
                  });
               } else {
                  res.json(result);
               }
            });
         } else {
            res.json({
               success: false,
               message: 'Profile with that name already exists'
            });
         }
      });
   }
};

exports.withUserId = function(req, res) {
   var token = req.query.token;
   var payload = jwt.verify(token, superSecret);
   var userid = payload._id;

   if (userid != null && userid != undefined) {
      mongo.getProfileWithUserId(userid, function(result) {
         if (result != null && result.success != false) {
            res.json({
               success: true,
               data: result
            });
         } else {
            res.json(result);
         }
      });
   } else {
      res.json({
         success: false,
         message: 'userid not found in query'
      });
   }
};

exports.update = function(req, res) {
   var profile = req.body.profile;

   if (profile != null && profile != undefined) {
      var token = req.body.token;
      var payload = jwt.verify(token, superSecret);
      var profileId = payload.profileId;

      profile._id = profileId;
      mongo.getProfiles({
         _id: profile._id
      }, function(result) {
         if (result.success != false && result.length == 1) {
            mongo.updateProfile(profile, function(result) {
               if (result.success != false) {
                  res.json({
                     success: true,
                     data: result
                  });
               } else {
                  res.json(result);
               }
            });
         } else {
            res.json({
               success: false,
               message: 'No profile found'
            });
         }
      });
   }
};
