var mongo = require('../mongo-client');
var sjcl = require('sjcl');
var jwt = require('jsonwebtoken');


//TODO: Get from conf file!
var encodePw = "dotamasterraceblizzardsucks";
var superSecret = "ilovedotadotaisthebest";

exports.requests = function(req, res) {
   var profileId = req.query.profileId;
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
      mongo.checkRequest({
         to: request.to,
         from: request.from
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
      mongo.removeRequest(requestId, function(result) {
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
   }
};
