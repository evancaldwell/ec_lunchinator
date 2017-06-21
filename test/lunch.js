// connect to the DB

// require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
// parent block
describe('Lunchinator', () => {
    // beforeEach((done) => { // before each test, ...
        
    // });

  // test the create-ballot /POST route
//   describe('/POST create-ballot', () => {
//       it('it should not POST a ballot without voting end time', (done) => {
//         let ballot = {
//             voters: [
//               { "name":"Bob", "email":"bob@lunch.co" },
//               { "name":"Jim", "email":"jim@lunch.co" }
//             ]
//         }
//         chai.request(server)
//             .post('/create-ballot')
//             .send(ballot)
//             .end((err, res) => {
//                 console.log(res.status);
//                 res.should.have.status(200);
//                 // res.body.should.be.a('object');
//                 // res.body.should.have.property('errors');
//                 // res.body.errors.should.have.property('pages');
//                 // res.body.errors.pages.should.have.property('kind').eql('required');
//               done();
//             });
//       });

//   });

  // test the ballot /GET route
  describe('/GET ballot', () => {
      it('it should GET a ballot with the specified ID', (done) => {
        chai.request(server)
            .get('/api/ballot')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.not.be.empty;
              done();
            });
      });
  });

  // test the vote /POST route
//   describe('/POST vote', () => {
//       it('it should not POST a vote without an email', (done) => {
//         let ballot = {
//             voters: [
//               { "name":"Bob", "email":"bob@lunch.co" },
//               { "name":"Jim", "email":"jim@lunch.co" }
//             ]
//         }
//         chai.request(server)
//             .post('/create-ballot')
//             .send(ballot)
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('errors');
//                 res.body.errors.should.have.property('pages');
//                 res.body.errors.pages.should.have.property('kind').eql('required');
//               done();
//             });
//       });

//   });

});