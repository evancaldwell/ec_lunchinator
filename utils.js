var http = require('http');
var baseRestUrl = 'http://interview-project-17987.herokuapp.com/api/';

let utils = {

  getAvgReviewRating: function(item) {
    console.log('in getAvg stuff');
    return new Promise((resolve, reject) => {
      console.log('in promise');
      // look up the rating and add it to the data
      http.get(baseRestUrl + 'reviews/' + item.name, function(res) {
          console.log('in promise get');
          var reviews = '';
          res.on('data', function(data) {
              reviews += data;
          });
          res.on('end', function() {
              console.log('in promise response end');
              var parsedReviews = JSON.parse(reviews);
              // console.log('parsed reviews: ', parsedReviews);
              var total = 0;
              for(index in parsedReviews) {
                total += parseInt(parsedReviews[index].rating);
              }
              var avgRating = Math.round(total / parsedReviews.length);
              console.log(item.name + ' total and avg: ',total, avgRating);
              item.averageReview = avgRating;
              resolve(item);
          })
      })
      .on('error', e => reject('There was an error: ', e.message));
    });
  }

}

module.exports = utils;