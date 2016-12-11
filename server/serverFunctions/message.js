var mongo = require('../mongo-client');
var sjcl = require('sjcl');
var jwt = require('jsonwebtoken');


//TODO: Get from conf file!
var encodePw = "dotamasterraceblizzardsucks";
var superSecret = "ilovedotadotaisthebest";

exports.messages = function(req, res) {
   var conversationId = req.query.conversationId;

   if (conversationId != null && conversationId != undefined) {
      var token = req.query.token;
      var payload = jwt.verify(token, superSecret);
      var profileId = payload.profileId;
      mongo.getConversations({
         _id: conversationId,
         participantIds: profileId
      }, function(result) {
         if (result.success != false && result.size != 0) {
            mongo.getMessages({
               conversationId: conversationId
            }, function(result) {
               if (result.success != false) {
                  for (var i = 0; i < result.length; i++) {
                     if (result[i].sender == payload.profileName) {
                        result[i].own = true;
                     } else {
                        result[i].own = false;
                     }
                  }
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
               message: "Conversation not found!"
            });
         }
      });
   }
};

exports.add = function(req, res) {
   var message = req.body.message;

   if (message != null && message != undefined) {
      var token = req.body.token;
      var payload = jwt.verify(token, superSecret);
      var profileId = payload.profileId;
      message.sender = payload.profileName;
      mongo.getConversations({
         _id: message.conversationId,
         participantIds: profileId
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
