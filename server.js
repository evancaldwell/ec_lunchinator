// BASE SETUP
// =============================================================================

// call the packages we need
let express    = require('express');        // call express
let app        = express();                 // define our app using express
let bodyParser = require('body-parser');    // for getting post data
let http       = require('http');           // for calling the restaurant api
let utils      = require('./utils');        // some utility functions

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// Connect app to Firebase and initialize
var fireAdmin = require("firebase-admin");
var serviceAccount = require("./lunchinator-f1902-firebase-adminsdk-v305r-5bf771edd5.json");
fireAdmin.initializeApp({
    credential: fireAdmin.credential.cert(serviceAccount),
    databaseURL: "https://lunchinator-f1902.firebaseio.com"
});
// Create the database object and test a reference
// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = fireAdmin.database();
var ref = db.ref("priorPicks");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

// base url for the restaurant api
var baseRestUrl = 'http://interview-project-17987.herokuapp.com/api/';

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('lunch is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Time for lunch baby!' });
});

// more routes for the API will happen here

router.route('/create-ballot')

    // create a ballot that includes voting closing time and a list of voters with email and name
    // response will incluse GUID as ballotId to be used in voting process
    .post(function(req, res) {
        var now = new Date();
        var endTime = req.body.endTime;
        // var voters = req.body.voters;
        // voters ? voters = JSON.parse(voters) : voters = null;
        var voters;
        if (req.body.voters) {
            voters = JSON.parse(req.body.voters);
        } else {
            voters = null;
        }

        if (!endTime) {
            res.status(418).json({error: 'An end time is required'});
        } else if (new Date(endTime) <= now) {
            res.status(418).json({error: 'The end time is already expired'});
        } else if (!voters || Object.keys(voters).length < 1) {
            res.status(418).json({error: 'There must be at least one voter'});
        } else {
            // create a reference to Firebase, save the basic ballot info and grab the key
            var ref = db.ref("ballots");
            var ballotKey = ref.push({endTime: endTime, voters: voters}).key;

            http.get(baseRestUrl + 'restaurants', function(res) {
                var body = ''; // Will contain the final response
                // Received data is a buffer.
                // Adding it to our body
                res.on('data', function(data){
                    body += data;
                });
                // After the response is completed, parse it to get an object
                res.on('end', function() {
                    var restaurants = JSON.parse(body); // list of all restaurants
                    var sugRestaurants = [];            // list of randomly selected restaurants
                    var currRestaurant, modSugRestaurants;
                    // loop through the restaurants and pick 5 at random
                    while (sugRestaurants.length < 5) {
                        currRestaurant = restaurants[Math.floor(Math.random()*restaurants.length)];
                        // make sure there are no duplicates
                        if(!sugRestaurants.includes(currRestaurant)) {
                            sugRestaurants.push(currRestaurant);
                        }
                    }
                    // loop through suggestions and add avg rating
                    modSugRestaurants = utils.getAvgReviews(sugRestaurants);
                });
            })
            // If any error has occured, log error to console
            .on('error', function(e) {
            console.log("Got error: " + e.message);
            });

            // TODO: move this to line 79 and test
            res.json({"ballotId": ballotKey});
        }

    });

router.route('/ballot/:ballotId')

    // create a ballot that includes voting closing time and a list of voters with email and name
    // response will incluse GUID as ballotId to be used in voting process
    .get(function(req, res) {
        var ballotId = req.params.ballotId;
        console.log('get ballotId: ', ballotId);
        var ref = db.ref("ballots/" + ballotId);
        ref.once("value", function(snapshot) {
          console.log('snapshot: ', snapshot.val());
          var ballot = snapshot.val();
          if (ballot.endTime < new Date()) {
            res.json({
              'suggestion': ballot.suggestion,
              'choices': ballot.choices
            });
          } else {
            res.json({
              'winner': ballot.winner,
              'choices': ballot.choices
            });
          }
        });
    });

router.route('/vote')

    // create a ballot that includes voting closing time and a list of voters with email and name
    // response will incluse GUID as ballotId to be used in voting process
    .post(function(req, res) {

    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
if(!module.parent){ // prevents a error when running tests while server is running
    app.listen(port);
}
console.log('Magic happens on port ' + port);

// for testing purposes
module.exports = app;