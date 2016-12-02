( function() {
   "use strict";
   // Load modules
   var express = require( 'express' );
   var mongo = require( './mongo-client' );
   var bodyParser = require( 'body-parser' );
   var jwt = require( 'jsonwebtoken' );
   var app = express();

   var encodePw = "dotamasterraceblizzardsucks";

   var sjcl = require( 'sjcl' );

   var superSecret = "ilovedotadotaisthebest";

   var serverPort = 8080;

   // Configuration
   app.use( bodyParser.json() );
   app.use( express.static( 'client' ) );

   /* Endpoints for maganing player profiles*/
   var apiRoutes = express.Router();

   apiRoutes.use( function( req, res, next ) {
      // check header or url parameters or post parameters for token
      var token = req.body.token || req.query.token;
      // decode token
      if ( token ) {
         validateToken( token, function( result ) {
            if ( result.success == true ) {
               req.decoded = result.decoded;
               next();
            } else {
               return res.status( 403 ).send( {
                  success: false,
                  message: 'Failed to authenticate token.'
               } );
            }
         } );
      } else {
         // if there is no token
         // return an error
         return res.status( 403 ).send( {
            success: false,
            message: 'No token provided.'
         } );
      }
   } );

   // Gets profiles with filter.
   apiRoutes.post( "/profiles", function( req, res ) {
      var filter = req.body.filters;
      if ( filter != null && filter != undefined ) {
         mongo.getProfiles( filter, function( result ) {
            if ( result.success != false ) {
               res.json( {
                  success: true,
                  data: result
               } );
            } else {
               res.json( result );
            }
         } );
      }
   } );

   // Gets profile with userid.
   apiRoutes.get( "/profile/userid", function( req, res ) {
      var userid = req.query.userid;
      if ( userid != null && userid != undefined ) {
         mongo.getProfileWithUserId( userid, function( result ) {
            if ( result != null && result.success != false ) {
               res.json( {
                  success: true,
                  data: result
               } );
            } else {
               res.json( result );
            }
         } );
      } else {
         res.json( {
            success: false,
            message: 'userid not found in query'
         } );
      }
   } );

   // Adds new profile to list.
   apiRoutes.post( "/profiles/add", function( req, res ) {
      var profile = req.body.profile;

      if ( profile != null && profile != undefined ) {
         mongo.getProfiles( {
            name: profile.name
         }, function( result ) {
            if ( result.success != false && result.data.length ==
               0 ) {
               mongo.addProfile( profile, function( result ) {
                  if ( result.success != false ) {
                     res.json( {
                        success: true,
                        data: result
                     } );
                  } else {
                     res.json( result );
                  }
               } );
            } else {
               res.json( {
                  success: false,
                  message: 'Profile with that name already exists'
               } );
            }
         } );
      }
   } );

   apiRoutes.post( "/profiles/update", function( req, res ) {
      var profile = req.body.profile;
      if ( profile != null && profile != undefined ) {
         mongo.getProfiles( {
            _id: profile._id
         }, function( result ) {
            if ( result.success != false && result.length == 1 ) {
               mongo.updateProfile( profile, function( result ) {
                  if ( result.success != false ) {
                     res.json( {
                        success: true,
                        data: result
                     } );
                  } else {
                     res.json( result );
                  }
               } );
            } else {
               res.json( {
                  success: false,
                  message: 'No profile found'
               } );
            }
         } );
      }
   } );

   apiRoutes.get( "/requests", function( req, res ) {
      var profileId = req.query.profileId;
      if ( profileId != null && profileId != undefined ) {
         mongo.getRequests( profileId, function( result ) {
            if ( result.success != false ) {
               res.json( {
                  success: true,
                  data: result
               } );
            } else {
               res.json( result );
            }
         } );
      }
   } );

<<<<<<< HEAD
   app.post( "/login", function( req, res ) {
      mongo.getUser( {
=======
   apiRoutes.post("/reguests/add", function(req, res) {
      var request = req.body.request;

      if (request != null && request != undefined) {
         mongo.checkRequest({
            to: request.to,
            from: request.from
         }, function(result) {
            if (result.success != false && result.data.length ==
               0) {
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
   });

   app.post("/login", function(req, res) {
      mongo.getUser({
>>>>>>> 21d0e82791a6d2020aa66b602b40432e6d18b430
         username: req.body.username
      }, function( result ) {
         var user = result;
         if ( result.success == false ) {
            res.json( result );
         } else if ( user == null ) {
            res.json( {
               success: false,
               message: 'Authentication failed. User not found.'
            } );
         } else if ( user ) {
            // check if password matches
            var decodedUserPw = sjcl.decrypt( encodePw, user.password );
            var decodedBodyPw = sjcl.decrypt( encodePw, req.body
               .password );
            if ( decodedUserPw != decodedBodyPw ) {
               res.json( {
                  success: false,
                  message: 'Authentication failed. Wrong password.'
               } );
            } else {
               var expriration = 60 * 60 * 24;

               if ( req.body.remember == true ) {
                  expriration = 60 * 60 * 24 * 100;
               }
               var token = jwt.sign( user, superSecret, {
                  expiresIn: expriration // expires in 24 hours unless remember == true
               } );

               // return the information including token as JSON
               res.json( {
                  success: true,
                  message: 'Enjoy your token!',
                  token: token
               } );
            }
         }
      } );
   } );

   app.post( "/register", function( req, res ) {
      //var cryptedPw = devolopCrypt(req.body.password);
      var user = {
         username: req.body.username,
         password: req.body.password
      };
      var nickName = req.body.nickname;

      if ( user.username != null && user.username != undefined &&
         user.password != null && user.password != undefined &&
         nickName != null && nickName != undefined ) {
         mongo.getUser( {
            username: user.username
         }, function( result ) {
            if ( result.success == false ) {
               res.json( result );
            } else if ( result == null ) {
               mongo.getProfiles( {
                  name: nickName
               }, function( profileResult ) {
                  if ( profileResult.success == false ) {
                     res.json( profileResult );
                  } else if ( profileResult.length == 0 ) {
                     mongo.register( user, function(
                        registerResult ) {
                        if ( registerResult.success ==
                           false ) {
                           res.json( profileResult );
                        } else {
                           var profile = {
                              userid: registerResult
                                 .ops[ 0 ]._id,
                              name: nickName,
                              platform: "",
                              interest: "",
                              active: false
                           };
                           mongo.addProfile( profile,
                              function( addResult ) {
                                 if ( addResult.success ==
                                    false ) {
                                    res.json(
                                       addResult
                                    );
                                 } else {
                                    res.json( {
                                       success: true,
                                       data: addResult
                                    } );
                                 }
                              } );

                        }
                     } );
                  } else {
                     res.json( {
                        "success": "false",
                        "message": "Nick name is already taken!"
                     } );
                  }
               } );
            } else {
               res.json( {
                  "success": "false",
                  "message": "User name is already taken!"
               } );
            }
         } );
      } else {
         res.json( {
            "success": "false",
            "message": "Fill all required fields"
         } );
      }
   } );

   function devolopCrypt( pass ) {
      var encodedPw = sjcl.encrypt( encodePw, pass );
      return encodedPw;
   }

   app.post( "/checkToken", function( req, res ) {
      var token = req.body.token || req.query.token;
      if ( token ) {
         validateToken( token, function( result ) {
            if ( result.success == true ) {
               res.json( {
                  "success": "true",
                  "message": "Token is valid"
               } );
            } else {
               res.json( {
                  "success": "false",
                  "message": "Token is invalid"
               } );
            }
         } );
      } else {
         return res.status( 403 ).send( {
            success: false,
            message: 'No token provided.'
         } );
      }
   } );

   app.use( '/api', apiRoutes );

   function validateToken( token, callback ) {
      jwt.verify( token, superSecret, function( err, decoded ) {
         if ( err ) {
            callback( {
               success: false,
               message: 'Failed to authenticate token.'
            } );
         } else {
            callback( {
               success: true,
               decoded: decoded
            } );
         }
      } );
   }

   /* Server */
   var server = app.listen( serverPort, function() {} );

   /* Models */
   var Profile = function( name, platform, interest ) {
      var profile = {
         "name": name,
         "platform": description,
         "interest": interest
      };

      return profile;
   }

   var JSONResponse = function( success, message ) {
      var response = {
         "success": success,
         "message": message
      }

      return response;
   }

}() )
