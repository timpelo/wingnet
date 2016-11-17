(function() {
  "use strict";
  // Load modules
  var express = require('express');
  var mongo = require('./mongo-client');
  var bodyParser = require('body-parser');
  var jwt    = require('jsonwebtoken');
  var app = express();

  var superSecret = "ilovedotadotaisthebest";

  var serverPort = 8080;



  // Configuration
  app.use(bodyParser.json());
  app.use(express.static('client'));

  /* Endpoints for maganing player profiles*/
  var apiRoutes = express.Router();

  apiRoutes.use(function(req, res, next) {
     // check header or url parameters or post parameters for token
     var token = req.body.token;
     // decode token
     if (token) {
       // verifies secret and checks exp
       jwt.verify(token, superSecret, function(err, decoded) {
         if (err) {
           return res.json({ success: false, message: 'Failed to authenticate token.' });
         } else {
           // if everything is good, save to request for use in other routes
           req.decoded = decoded;
           next();
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
      mongo.addProfile(profile, function(result) {
          res.json(result);
      });
    }
  });

  apiRoutes.get("/requests/:profileId",function(req, res) {
     var profileId = req.params.profileId.toString();

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
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {

          var token = jwt.sign(user, superSecret, {
             expiresIn: 60*60*24 // expires in 24 hours
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
     var user = {username: req.body.username,
                  password: req.body.password};

     if(user.username != null && user.username != undefined
          && user.password != null && user.password != undefined) {

        mongo.getUser({username: user.username}, function(result){
          console.log(result);
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



  app.use('/api', apiRoutes);



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
