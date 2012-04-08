var gm = require('gm'),
easyimg = require('easyimage'),
fs = require('fs'),
Lexer = require('./lib/lexer'),
POSTagger = require('./lib/POSTagger');

function toTitleCase(str)
{
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

generateAlbum = function (name,image,quote,dst,res) {
  var outputFile = dst + Date.now() + '.jpg';

  // Generate album name
  var words = new Lexer().lex(quote),
  taggedWords = new POSTagger().tag(words);
  /*dict = {};
  for (i in taggedWords) {
    var tag = taggedWords[i][1];
    if (!dict[tag]) {
      dict[tag] = new Array();
    }
    dict[tag].push(taggedWords[i][0]);
  }*/

  // Build tag list
  var tags = new Array();
  for (var i in taggedWords) {
    tags.push(taggedWords[i][1]);
  }

  // Valid starts
  var starts = ['JJ','JJS','JJR','VB','NN'];
  var startind = tags.indexOf(
    starts[Math.floor(Math.random()*starts.length)]);
  if (startind < 0) startind = Math.floor(Math.random()*tags.length);
  var albumTitle = "";
  for (var i = startind; i < tags.length && i-startind < 5; i++) {
    if (i == startind) albumTitle += taggedWords[i][0];
    else if (tags[i] == "NN") albumTitle += " " + taggedWords[i][0];
  }

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
          .font('./fonts/Karla-Regular.ttf',24)
          .fill('#000')
          .drawText(0,34,name,'North')
          .drawText(0,10,toTitleCase(albumTitle),'South')
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

