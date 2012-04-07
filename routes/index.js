require('../fakealbum');
require('../extractlinks');
var url = require('url');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Duke Fake Album Generator' });
};

exports.fakealbum = function(req, res){
  // Check for all inputs
  if (req && req.query && req.query.name && req.query.image && req.query.quote) {
      // Extract data from url
      extractLinks(req.url, function(data) {
        console.log(data);
        // Pass response to generateAlbum and let it handle serving
        generateAlbum(
          data.name,   // album name
          data.image,  // image url
          data.quote,  // album quote
          './albumcovers/', // output directory
          res
        );
      });
  } else {
    res.render('index', { title: 'Duke Fake Album Generator' });
  }
};
