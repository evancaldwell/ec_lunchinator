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
        // TODO: create a date in the future to use on tests
    // });

  // test the create-ballot /POST route
  describe('/POST create-ballot', () => {
      it('it should not POST a ballot without voting end time', (done) => {
        let ballot = {
            voters: [
              { "name":"Bob", "email":"bob@lunch.co" },
              { "name":"Jim", "email":"jim@lunch.co" }
            ]
        }
        chai.request(server)
            .post('/api/create-ballot')
            .send(ballot)
            .end((err, res) => {
                res.should.have.status(418);
                res.body.should.have.property('error').eql('An end time is required');
              done();
            });
      });
      it('it should not POST a ballot with expired voting end time', (done) => {
        let ballot = {
            voters: [
              { "name":"Bob", "email":"bob@lunch.co" },
              { "name":"Jim", "email":"jim@lunch.co" }
            ],
            endTime: "1/21/2017 11:00"
        }
        chai.request(server)
            .post('/api/create-ballot')
            .send(ballot)
            .end((err, res) => {
                res.should.have.status(418);
                res.body.should.have.property('error').eql('The end time is already expired');
              done();
            });
      });
      it('it should not POST a ballot without at least one voter', (done) => {
        let ballot = {
            endTime: "12/21/2017 11:00"
        }
        chai.request(server)
            .post('/api/create-ballot')
            .send(ballot)
            .end((err, res) => {
                res.should.have.status(418);
                res.body.should.have.property('error').eql('There must be at least one voter');
              done();
            });
      });
      it('it should POST a ballot and return a ballotId', (done) => {
        let ballot = {
            voters: [
              { name:"Bob", email:"bob@lunch.co" },
              { name:"Jim", email:"jim@lunch.co" }
            ],
            endTime: "12/21/2017 11:00"
        }
        chai.request(server)
            .post('/api/create-ballot')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(ballot)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ballotId').should.not.be.empty;
              done();
            });
      });

  });

  // test the ballot /GET route
  describe('/GET ballot/:ballotId', () => {
      it('it should GET a ballot with the specified ID', (done) => {
        chai.request(server)
            .get('/api/ballot/' + 'exampleBallot')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('endTime');
                res.body.should.have.property('voters').should.not.be.empty;
                res.body.voters.should.have.lengthOf(2);
                res.body.voters[0].should.have.property('email').eql('bob@lunch.co');
                res.body.voters[0].should.have.property('name').eql('Bob');


                res.body.should.have.property('suggestion').should.not.be.empty;
                res.body.suggestion.should.have.property('id').should.not.be.empty;
                res.body.suggestion.should.have.property('name').should.not.be.empty;
                res.body.suggestion.should.have.property('averageReview').should.not.be.empty;
                res.body.suggestion.should.have.property('topReviewer').should.not.be.empty;
                res.body.suggestion.should.have.property('review').should.not.be.empty;
                
                res.body.should.have.property('choices').should.not.be.empty;
                res.body.choices.should.have.lengthOf(5);
                res.body.choices[0].should.have.property('id').should.not.be.empty;
                res.body.choices[0].should.have.property('name').should.not.be.empty;
                res.body.choices[0].should.have.property('averageReview').should.not.be.empty;
                res.body.choices[0].should.have.property('description').should.not.be.empty;
              done();
            });
      });
  });

  // test the vote /POST route
  describe('/POST vote', () => {
      it('it should not POST a vote without an email', (done) => {
        let ballot = {
            voters: [
              { "name":"Bob", "email":"bob@lunch.co" },
              { "name":"Jim", "email":"jim@lunch.co" }
            ]
        }
        chai.request(server)
            .post('/api/create-ballot')
            .send(ballot)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('pages');
                res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });

  });

});