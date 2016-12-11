var mongo = require('../mongo-client');
var sjcl = require('sjcl');
var jwt = require('jsonwebtoken');


//TODO: Get from conf file!
var encodePw = "dotamasterraceblizzardsucks";
var superSecret = "ilovedotadotaisthebest";

exports.conversations = function(req, res) {
   var token = req.query.token;
   var payload = jwt.verify(token, superSecret);
   var profileId = payload.profileId;
   if (profileId != null && profileId != undefined) {
      mongo.getConversations({
         participantIds: profileId
      }, function(result) {
         if (result.success != false) {
            for (var i = 0; i < result.length; i++) {
               var index = result[i].participantNames.indexOf(payload.profileName);
               result[i].participantNames.splice(index, 1);
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
         message: "Error"
      });
   }
};

exports.add = function(req, res) {
   var conversation = req.body.conversation;

   if (conversation != null && conversation != undefined) {
      mongo.getConversations({
         participantIds: conversation.participantIds
      }, function(result) {
         if (result.success != false && result.length == 0) {
            mongo.addConversation(conversation, function(
               result) {
               if (result.success != false) {
                  res.json({
                     success: true,
                     message: "Conversation created!",
                     data: result
                  });
               } else {
                  res.json(result);
               }
            });
         } else {
            res.json({
               success: false,
               message: 'You already have conversation open'
            });
         }
      });
   }
};
