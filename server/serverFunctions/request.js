var mongo = require('../mongo-client');
var sjcl = require('sjcl');
var jwt = require('jsonwebtoken');

//TODO: Get from conf file!
var encodePw = "dotamasterraceblizzardsucks";
var superSecret = "ilovedotadotaisthebest";

exports.requests = function(req, res) {
   var token = req.query.token;
   var payload = jwt.verify(token, superSecret);
   var profileId = payload.profileId;
   var inOut = req.query.inOut;
   if (profileId != null && profileId != undefined &&
      inOut != null && inOut != undefined) {
      mongo.getRequests(profileId, inOut, function(result) {
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
   var request = req.body.request;

   if (request != null && request != undefined) {
      var token = req.body.token;
      var payload = jwt.verify(token, superSecret);
      var profileId = payload.profileId;
      request.from = profileId;
      mongo.checkRequest({
         $or: [{
            to: request.to,
            from: request.from
         }, {
            to: request.from,
            from: request.to
         }, ]
      }, function(result) {
         if (result.success != false && result.length == 0) {
            mongo.addRequest(request, function(result) {
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
               message: 'You already have request pending'
            });
         }
      });
   }
};

exports.delete = function(req, res) {
   var requestId = req.query.requestId;

   if (requestId != null && requestId != undefined) {
      var token = req.body.token;
      var payload = jwt.verify(token, superSecret);
      var profileId = payload.profileId;
      mongo.removeRequest(requestId, profileId, function(result) {
         if (result.success != false) {
            res.json({
               success: true,
               message: 'Request removed!'
            });
         } else {
            res.json(result);
         }
      });
   }
};

exports.update = function(req, res) {
   var request = req.body.request;
   if (request != null && request != undefined) {
      var token = req.body.token;
      var payload = jwt.verify(token, superSecret);
      var profileId = payload.profileId;

      if (request.to == profileId) {
         mongo.updateRequest(request, function(result) {
            if (result.success != false) {
               res.json({
                  success: true,
                  message: "Request updated",
                  data: result
               });
            } else {
               res.json(result);
            }
         });
      } else {
         res.json({
            success: false,
            message: "You don't have permission to update request!",
            data: result
         });
      }

   }
};
