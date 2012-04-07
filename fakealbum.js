easyimg = require('easyimage'),
fs = require('fs');

generateAlbum = function (name,image,quote,dst,res) {
  var outputFile = dst + Date.now() + '.jpg';
  easyimg.info(image,function(err,info) {
    // Resize image so min dimension is 400
    var resSize = 400/Math.min(info.width,info.height)*Math.max(info.width,info.height);

    // Resize and crop to 400x400
    easyimg.rescrop(
      {
        src: image,
        dst: outputFile,
        width: resSize,
        height: resSize,
        cropwidth: 400,
        cropheight: 400,
        x: 0,
        y: 0,
        gravity: 'Center'
      },
      function(err) {
        if (err) throw err;

        // Perform image manipulations here
        cmd = 'convert -background none -undercolor none -fill black ' +
          '-font Helvetica -pointsize 24 -gravity center ' +
          '-draw "text 0,0 \'' + quote + '\'" ' +
          outputFile + ' ' + outputFile;
        console.log(cmd);
        easyimg.exec(
          cmd
          , function() {
            // Read binary data from file
            var imgbin = fs.readFileSync(outputFile);
            // Send response
            res.send(imgbin,{'Content-Type': 'image/jpeg'}, 200);
          }
        );
      }
    );
  });
}

