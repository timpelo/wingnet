var mongo = require('../mongo-client');
var sjcl = require('sjcl');
var jwt = require('jsonwebtoken');


//TODO: Get from conf file!
var encodePw = "dotamasterraceblizzardsucks";
var superSecret = "ilovedotadotaisthebest";

exports.messages = function(req, res) {
   var conversationId = req.query.conversationId;

   if (conversationId != null && conversationId != undefined) {
      mongo.getMessages({
         conversationId: conversationId
      }, function(result) {
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
   var message = req.body.message;

   if (message != null && message != undefined) {
      mongo.getConversations({
         _id: message.conversationId
      }, function(result) {
         if (result.success != false && result.length == 1) {
            mongo.addMessage(message, function(
               result) {
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
               message: "You don't have conversation open"
            });
         }
      });
   }
};
