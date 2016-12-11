(function() {
   "use strict";
   // Load modules
   var express = require('express');
   var mongo = require('./mongo-client');
   var bodyParser = require('body-parser');
   var jwt = require('jsonwebtoken');
   var app = express();

   var encodePw = "dotamasterraceblizzardsucks";

   var sjcl = require('sjcl');

   var superSecret = "ilovedotadotaisthebest";

   var serverPort = 8080;

   var loginRegister = require('./serverFunctions/loginRegister');
   var profile = require('./serverFunctions/profile');
   var request = require('./serverFunctions/request');
   var conversation = require('./serverFunctions/conversation');
   var message = require('./serverFunctions/message');

   // Configuration
   app.use(bodyParser.json());
   app.use(express.static('client'));

   /* Endpoints for maganing player profiles*/
   var apiRoutes = express.Router();

   apiRoutes.use(function(req, res, next) {
      // check header or url parameters or post parameters for token
      var token = req.body.token || req.query.token;
      // decode token
      if (token) {
         validateToken(token, function(result) {
            if (result.success == true) {
               req.decoded = result.decoded;
               next();
            } else {
               return res.status(403).send({
                  success: false,
                  message: 'Failed to authenticate token.'
               });
            }
         });
      } else {
         // if there is no token
         // return an error
         return res.status(403).send({
            success: false,
            message: 'No token provided.'
         });
      }
   });

   // Gets profiles with filter.
   apiRoutes.post("/profiles", profile.profiles);

   // Gets profile with userid.
   apiRoutes.get("/profile/userid", profile.withUserId);

   // Adds new profile to list.
   apiRoutes.post("/profiles/add", profile.add);

   apiRoutes.post("/profiles/update", profile.update);

   apiRoutes.get("/requests", request.requests);

   apiRoutes.post("/requests/add", request.add);

   apiRoutes.delete("/requests/delete", request.delete);

   apiRoutes.post("/requests/update", request.update);

   apiRoutes.get("/conversations", conversation.conversations);

   apiRoutes.post("/conversations/add", conversation.add);

   apiRoutes.get("/messages", message.messages);

   apiRoutes.post("/messages/add", message.add);

   app.post("/login", loginRegister.login);

   app.post("/register", loginRegister.register);

   function devolopCrypt(pass) {
      var encodedPw = sjcl.encrypt(encodePw, pass);
      return encodedPw;
   }

   app.post("/checkToken", function(req, res) {
      var token = req.body.token || req.query.token;
      if (token) {
         validateToken(token, function(result) {
            if (result.success == true) {
               res.json({
                  "success": "true",
                  "message": "Token is valid"
               });
            } else {
               res.json({
                  "success": "false",
                  "message": "Token is invalid"
               });
            }
         });
      } else {
         return res.status(403).send({
            success: false,
            message: 'No token provided.'
         });
      }
   });

   app.use('/api', apiRoutes);

   function validateToken(token, callback) {
      jwt.verify(token, superSecret, function(err, decoded) {
         if (err) {
            callback({
               success: false,
               message: 'Failed to authenticate token.'
            });
         } else {
            callback({
               success: true,
               decoded: decoded
            });
         }
      });
   }

   /* Server */
   var server = app.listen(serverPort, function() {});

   /* Models */
   var Profile = function(name, platform, interest) {
      var profile = {
         "name": name,
         "platform": description,
         "interest": interest
      };

      return profile;
   }

   var JSONResponse = function(success, message) {
      var response = {
         "success": success,
         "message": message
      }

      return response;
   }

}());
