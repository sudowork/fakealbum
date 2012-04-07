gm = require('gm');
easyimg = require('easyimage');
fs = require('fs');

generateAlbum = function (name,image,quote,dst,res) {
  var outputFile = dst + Date.now() + '.jpg';

  // Convert file to jpg using imagemagick
  easyimg.convert(
    {
      src: image,
      dst: outputFile,
      quality: 100

    }, function(err,stdout,stderr) {
      // Use GM to manipulate image
      var img = gm(outputFile);

      // get image dimensions
      img.size(function(err,value) {
        if (err) throw err;
        var resSize = 400/Math.min(value.width,value.height)*Math.max(value.width,value.height);

        // Manipulations
        this 
          .resize(resSize,resSize)
          .gravity('Center')
          .crop(400,400)
          .gravity('North') // Change for text placement
          .font('Helvetica',24)
          .stroke('#fff',1)
          .fill('#000')
          .drawText(0,-10,name)
          .gravity('South')
          .drawText(0,10,quote)
          .write(outputFile,function(err) {
            if (err) console.log(err);
            // Send image response
            var imgbin = fs.readFileSync(outputFile);
            res.send(imgbin,{'Content-Type': 'image/jpeg'}, 200);
          });
      });
    }
  );

  /*easyimg.info(image,function(err,info) {
    // Resize image so min dimension is 400

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
          '-draw "text 0,0 \'' + name + '\'" ' +
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
  });*/
}

