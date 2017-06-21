// BASE SETUP
// =============================================================================

// call the packages we need
let express    = require('express');        // call express
let app        = express();                 // define our app using express
let bodyParser = require('body-parser');

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

// more routes for our API will happen here
// // on routes that end in /years
// ----------------------------------------------------
router.route('/years')

    // create a year (accessed at POST http://localhost:8080/api/years)
    .post(function(req, res) {

        // ...

    })

    // get all the years (accessed at GET http://localhost:8080/api/years)
    .get(function(req, res) {
        // Bear.find(function(err, years) {
        //     if (err)
        //         res.send(err);
        //
        //     res.json(years);
        // });
        var ref = db.ref("ipedsData/2002/189264");
        ref.once("value", function(snapshot) {
          console.log(snapshot.val().CHFNM);
          res.json(snapshot.val());
          console.log('################################################');
          console.log(res);
        });
    });

router.route('/create-ballot')

    // create a ballot that includes voting closing time and a list of voters with email and name
    // response will incluse GUID as ballotId to be used in voting process
    .post(function(req, res) {
        var endTime = req.body.endTime;
        var voters = JSON.parse(req.body.voters);
        console.log('endtime: ', endTime);
        console.log('voters: ', voters);

        var ref = db.ref("ballots");
        var ballotKey = ref.push({endTime: endTime, voters: voters}).key;

        res.json({"ballotId": ballotKey});
    });

router.route('/ballot')

    // create a ballot that includes voting closing time and a list of voters with email and name
    // response will incluse GUID as ballotId to be used in voting process
    .get(function(req, res) {
        var ref = db.ref("ballots");
        ref.once("value", function(snapshot) {
          res.json(snapshot.val());
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