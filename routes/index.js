require('../fakealbum.js');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Duke Fake Album Generator' });
};

exports.fakealbum = function(req, res){
  // Check for all inputs
  if (req && req.query && req.query.name && req.query.image && req.query.quote) {
      // Pass response to generateAlbum and let it handle serving
      generateAlbum(
        req.query.name,   // album name
        req.query.image,  // image url
        req.query.quote,  // album quote
        './albumcovers/', // output directory
        res
      );
  } else {
    res.render('index', { title: 'Duke Fake Album Generator' });
  }
};
