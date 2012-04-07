easyimg = require('easyimage'),
fs = require('fs');

generateAlbum = function (name,image,quote,dst,res) {
  var outputFile = dst + Date.now() + '.jpg';
  var img = easyimg.rescrop(
    {
      src: image,
      dst: dst + Date.now() + '.jpg',
      width: 500,
      height: 500,
      cropwidth: 500,
      cropheight: 500,
      x: 0,
      y: 0,
      gravity: 'Center'
    },
    function(err) {
      if (err) throw err;
      // Read binary data from file
      var imgbin = fs.readFileSync(outputFile);
      // Send response
      res.send(imgbin,{'Content-Type': 'image/jpeg'}, 200);
    }
  );
}

