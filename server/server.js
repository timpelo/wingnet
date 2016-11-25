(function() {
  "use strict";
  // Load modules
  var express = require('express');
  var mongo = require('./mongo-client');
  var bodyParser = require('body-parser');
  var jwt    = require('jsonwebtoken');
  var app = express();

  var encodePw = "dotamasterraceblizzardsucks";

  var sjcl = require('sjcl');

  var superSecret = "ilovedotadotaisthebest";

  var serverPort = 8080;

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
        validateToken(token, function(result){
           if(result.success == true) {
             req.decoded = result.decoded;
             next();
          } else {
             return res.json({ success: false, message: 'Failed to authenticate token.' });
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
  apiRoutes.post("/profiles", function(req, res) {
    var filter = req.body.filters;
    if(filter != null && filter != undefined) {
      mongo.getProfiles(filter, function(result) {
        res.json(result);
      });
    }
  });

  // Adds new profile to list.
  apiRoutes.post("/profiles/add", function(req, res) {
    var profile = req.body.profile;

    if(profile != null && profile != undefined) {
      mongo.getProfiles({name : profile.name}, function(result){
         if(result.length == 0) {
            mongo.addProfile(profile, function(result) {
                res.json(result);
            });
         } else {
            res.json({ success: false, message: 'Profile with that name already exists' });
         }
      });

    }
  });

  apiRoutes.get("/requests",function(req, res) {
     var profileId = req.query.profileId;
     if (profileId != null && profileId != undefined) {
       mongo.getRequests(profileId, function(result) {
           res.json(result);
       });
     }
  });

  app.post("/login", function(req, res) {
     mongo.getUser({username: req.body.username}, function(user) {
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
        // check if password matches
        var decodedUserPw = sjcl.decrypt(encodePw, user.password);
        var decodedBodyPw = sjcl.decrypt(encodePw, req.body.password);
        if (decodedUserPw != decodedBodyPw) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          var expriration =  60*60*24;

          if(req.body.remember == true) {
             expriration = 60*60*24*100;
          }
          var token = jwt.sign(user, superSecret, {
             expiresIn: expriration // expires in 24 hours unless remember == true
          });

          // return the information including token as JSON
          res.json({
             success: true,
             message: 'Enjoy your token!',
             token: token
          });
        }
      }
    });
  });

  app.post("/register", function(req, res) {
     var cryptedPw = devolopCrypt(req.body.password);
     var user = {username: req.body.username,
                  password: cryptedPw};

     if(user.username != null && user.username != undefined
          && user.password != null && user.password != undefined) {

        mongo.getUser({username: user.username}, function(result){
          if (result == null) {
             mongo.register(user, function(result){
                res.json(result);
             });
          } else {
             res.json({"success" : "false", "message": "User name is already taken!"});
          }
        });

     }
  });

  function devolopCrypt(pass) {
     var encodedPw = sjcl.encrypt(encodePw, pass);
     return encodedPw;
 }

  app.post("/checkToken", function(req, res) {
     var token = req.body.token || req.query.token;
    if (token) {
      validateToken(token,function(result){
         if (result.success == true) {
            res.json({"success":"true", "message":"Token is valid"});
         } else {
            res.json({"success":"false", "message":"Token is invalid"});
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
          callback({success: false, message: 'Failed to authenticate token.' });
        } else {
          callback({success: true, decoded: decoded});
        }
      });
   }

  /* Server */
  var server = app.listen(serverPort, function() {
  });

  /* Models */
  var Profile = function(name, platform, interest) {
    var profile = {
      "name":name,
      "platform":description,
      "interest":interest
    };

    return profile;
  }

  var JSONResponse = function(success, message) {
    var response = {
      "success":success,
      "message":message
    }

    return response;
  }

}())
