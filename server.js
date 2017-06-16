// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// Connect app to Firebase and initialize
var fireAdmin = require("firebase-admin");
// fireAdmin.initializeApp({
//   credential: fireAdmin.credential.cert({
//     type: "service_account",
//     project_id: "lunchinator-f1902",
//     private_key_id: "452c7f9a0468b5d2414f292dfb7e3658488d5a7e",
//     private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDJV/n0mBegJeuU\nVzUHiwDs6POQwosK7GQpWqJVnkwanUGE6HrDKPcvcNcO2Eh+qKgaig+xIKTHP6es\nT0mW6FsW8fVjqgjhhKb/5OhhlZ9SHybF3poYYOluEW4OwjpAa51b/k6BlN7E1WrU\nGdNjq0ycZy5Ie7NaE9UTgFQSU8ENLtm7eKBzDtybm/aGoaiefAhMrh3wKZecLmww\nY6p7X0MCm/koH4hyhu7Bbj8aABYL1/hE1l5Uoq0ma8pXiWkJyq595RjfbFoQKAi3\nSz+vG2vAbOKs6Itp3vrDBSTfO/yM3jZPPo1ZJI4Ip/tJ6hxy8p262G5AtHJE/B35\nJzohyuEzAgMBAAECggEADlaIg0WNcSciJpcrPJVGhJh2N9nSwv1giJ1esBAsxTxr\nnQZdL6asK6GyfukiCHsENZedVHTJpzK+QwQGbouvaOvkGKvUJBMpPVHUxpY8GUIE\npdSbTp8gIGl3V++27D19oD504r9yObwk9mO8bP2W4BBs+FZuyDxfURszYXa7aa/L\nDUOie3IeLYIuuw1VoHaPGjt7M7bgwWWA4NprSsVyVF5ufJuR0igOY1zo+R3PnJ/c\n0Sa5TfqNt6PJoHyfV32yD++R6dZ/zdr3UXxyhjzwL9Hdybe8B9BoTBR4XRxjQ+Kh\ny6oB13I9ehsZbw3NZD1Jatl//fLlDhNokqUw4DoB2QKBgQDtia30oZYV32dkP5rV\nrdpLiN2qlsLaZdfe/u5mWeA7PdWxeVPMg37OCdbvBrU71tzVZ1+5+pFbBvsjoOf0\npYnVeDsF1ol6fhZ0GliJLXHLh7RIEO0rSrilBLDdcdbX26mjsnMFpYoUjKR6Ob6Q\nxELvpRu5aJe3FLgv15dzxh27XQKBgQDY/iMbxO6tMa5jJUnRQCilMIBXTvmOMCAf\nP23oZ+Mhx3m2e/GdOx6yjIPSS6N0ikBySrOPFch+DLUX6lf18t6hT7yDaBa6sJRl\nXBHQahrt6DGTqm89QoGMvAnDlUl6B2Kqu03jcjbBbtE6n4shX+E7NvuTsC9vmjdj\nWXhS7IzVzwKBgQC2YlA+1RL4GGC6iFvKVYKXHK+Wm8thBXGKtxM1YyzYT9IUQqQl\nE5H5gXSWcwAUwhUthgHqOooA6otJ//IZ1kDOt1IaWW+VrdpvqwrvyQTm0XuLGfQA\nmY7MpZ1nalEbzH2kQxAt9bzfql1fu5amcQs0FgIDiltzJ2WE1nRjYGrTwQKBgQDI\nexTo5Sw3bD1YcO0gnYxwAr2w7NB45FHpTOs43DLn1KrJRP5YbHTSNizcsPGWDN26\nOvZm7pNMkmUGcYdPP1Md6tOa/SJy3g5dD5GN41p6EBst+TvJd5bF9j13LIi0a/pn\nD6LIz49za/V3mkwrS7CGyyfordFF5U/jRJh81PzR1QKBgQCzZiS+J/a6FIZInXM7\nqo/l4AmYeYHozsqEqOpy5X3YlbEVYe1GoTUSVKA04aC/LhZ12HcIZ1v1+HPPJhTP\ng23/HMOZbdHhzLIDVG0eDQWU3rLSo+XaosLPj1sF+E2hmWxhd1T30W0PPaPfiXJi\nLCakGZL84JrDM99T9fwQoc1Khg==\n-----END PRIVATE KEY-----\n",
//     client_email: "firebase-adminsdk-zcsgv@rbdcdataviz.iam.gserviceaccount.com",
//     client_id: "105892584725408200713",
//     auth_uri: "https://accounts.google.com/o/oauth2/auth",
//     token_uri: "https://accounts.google.com/o/oauth2/token",
//     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//     client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zcsgv%40rbdcdataviz.iam.gserviceaccount.com"
//   }),
//   databaseURL: "https://lunchinator-f1902.firebaseio.com"
// });
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
    .post(function(req, res) {

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
app.listen(port);
console.log('Magic happens on port ' + port);
