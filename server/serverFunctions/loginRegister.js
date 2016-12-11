var mongo = require('../mongo-client');
var sjcl = require('sjcl');
var jwt = require('jsonwebtoken');


//TODO: Get from conf file!
var encodePw = "dotamasterraceblizzardsucks";
var superSecret = "ilovedotadotaisthebest";

exports.login = function(req, res) {
   mongo.getUser({
      username: req.body.username
   }, function(result) {
      var user = result;
      if (result == null) {
         res.json({
            success: false,
            message: 'Authentication failed. User not found.'
         });
      } else if (result.success == false) {
         res.json(result);
      } else if (user) {
         // check if password matches
         var decodedUserPw = sjcl.decrypt(encodePw, user.password);
         var decodedBodyPw = sjcl.decrypt(encodePw, req.body
            .password);
         if (decodedUserPw != decodedBodyPw) {
            res.json({
               success: false,
               message: 'Authentication failed. Wrong password.'
            });
         } else {
            var expriration = 60 * 60 * 24;

            if (req.body.remember == true) {
               expriration = 60 * 60 * 24 * 100;
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
};

exports.register = function(req, res) {
   //var cryptedPw = devolopCrypt(req.body.password);
   var user = {
      username: req.body.username,
      password: req.body.password
   };
   var nickName = req.body.nickname;

   if (user.username != null && user.username != undefined &&
      user.password != null && user.password != undefined &&
      nickName != null && nickName != undefined) {
      mongo.getUser({
         username: user.username
      }, function(result) {
         if (result == null) {
            mongo.getProfiles({
               name: nickName
            }, function(profileResult) {
               if (profileResult.success == false) {
                  res.json(profileResult);
               } else if (profileResult.length == 0) {
                  mongo.register(user, function(
                     registerResult) {
                     if (registerResult.success ==
                        false) {
                        res.json(profileResult);
                     } else {
                        var profile = {
                           userid: registerResult
                              .ops[0]._id,
                           name: nickName,
                           platform: "",
                           interest: "",
                           active: false
                        };
                        mongo.addProfile(profile,
                           function(addResult) {
                              if (addResult.success ==
                                 false) {
                                 res.json(
                                    addResult
                                 );
                              } else {
                                 res.json({
                                    success: true,
                                    data: addResult
                                 });
                              }
                           });

                     }
                  });
               } else {
                  res.json({
                     "success": false,
                     "message": "Nick name is already taken!"
                  });
               }
            });
         } else {
            res.json({
               "success": false,
               "message": "User name is already taken!"
            });
         }
      });
   } else {
      res.json({
         "success": false,
         "message": "Fill all required fields"
      });
   }
};
