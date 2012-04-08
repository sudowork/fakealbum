var gm = require('gm'),
easyimg = require('easyimage'),
fs = require('fs'),
Lexer = require('./lib/lexer'),
POSTagger = require('./lib/POSTagger');
var getBestRow = require('./image');

function toTitleCase(str)
{
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

generateAlbum = function (name,image,quote,dst,res) {
  var outputFile = dst + Date.now() + '.jpg';

  // Generate album name
  var words = new Lexer().lex(quote),
  taggedWords = new POSTagger().tag(words);
  console.log(taggedWords);

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
  console.log(startind);
  var albumTitle = "";
  for (var i = startind; i < tags.length && i-startind < 5; i++) {
    if (i == startind) albumTitle += taggedWords[i][0];
    else if (tags[i] == "NN") albumTitle += " " + taggedWords[i][0];
  }

  // Choose font
  var fonts = ['Belleza-Regular.ttf', 'DellaRespira-Regular.ttf', 'Dosis-Regular.ttf', 'Karla-Regular.ttf', 'Rosarivo-Regular.ttf'];
  var font = fonts[Math.floor(Math.random()*fonts.length)];

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
          .enhance()
          .gravity('Center')
          .crop(400,400)
          .write(outputFile,
            function() {
              // Get best row
              getBestRow(outputFile, function(row,color) {
                gm(outputFile)
                .font('./fonts/' + font,400/name.length*1.25)
                .fill(color)
                .drawText(0,row-25,name.toUpperCase(),'North')
                .fontSize(24)
                .drawText(0,row,albumTitle.toUpperCase(),'North')
                .write(outputFile,function(err) {
                  if (err) console.log(err);
                  easyimg.exec("convert " + outputFile
                    + " -gravity 'NorthEast' -draw \"image Over 10,10 0,0 './images/parental.jpg'\" "
                    + outputFile,
                    function(err) {
                      // Send image response
                      var imgbin = fs.readFileSync(outputFile);
                      res.send(imgbin,{'Content-Type': 'image/jpeg'}, 200);
                    }
                  );
                });
              });
            }
          );
      });
    }
  );

}

