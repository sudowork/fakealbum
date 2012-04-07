var http = require('http');

function getHostAndPath(url) {
  var removeprotocol = url.replace(/(\w*:\/\/)/, ''),
      split = removeprotocol.split('/'),
      host = split[0],
      path;

  // remove host and extract path
  split.splice(0, 1);
  path = '/' + split.join('/');

  return {
    host: host,
    path: path,
    port: 80
  };
}

function sendRequest(url, onEnd, onCompletion) {
    http.request(
    getHostAndPath(url),
    function(response) {
      var data = '';
      response.on('data', function(chunk) { data += chunk.toString(); });
      response.on('end', function () { onEnd(data, onCompletion); });
    }
  ).end();
}

function image(data, callback) {
  var matches = data.match(/<img src="([^"]+)" alt="photo"/);
  if (matches && matches.length > 1) {
    callback({ image : matches[1] });
  }
}

function quote(data, callback) {
  var quotematches = data.match(/<dt>([^<]+)<\/dt>/),
      authormatches = data.match(/<dd class="author">[^<]*<b><a href="\/quotes\/\w+\/">([^<]+)<\/a>/);
  if (quotematches && quotematches.length > 1) {
    callback({ quote : quotematches[1] });
  }
  if (authormatches && authormatches.length > 1) {
    callback({ author : authormatches[1] });
  }
}

function title(data, callback) {
  var matches = data.match(/<h1 id="firstHeading" class="firstHeading">[^<]*<span dir="auto">([^<]+)<\/span>[^<]*<\/h1>/);
  if (matches && matches.length > 1 && callback) {
    callback({ title : matches[1] });
  }
}

extractLinks = function(url, callback) {
  var removeprefix = url.match(/.*\/fakealbum\?(.+)/, '');
      links = removeprefix[1].split(/\=|\&/),
      data = {};
  function update(obj) {
    if (obj) {
      if (obj.image) data.image = obj.image;
      if (obj.quote) data.quote = obj.quote;
      if (obj.author) data.author = obj.author;
      if (obj.title) data.title = obj.title;

      if (data.image && data.quote && data.author && data.title) {
        callback(data);
      }
    }
  }
  sendRequest(links[1], title, update);
  sendRequest(links[3], image, update);
  sendRequest(links[5], quote, update);
}
/*
function onDataReady(data) {
  console.log(data);
}*/
/*
var ec2url = 'ec2-23-20-193-65.compute-1.amazonaws.com',
urls = [
  '<ec2url>/fakealbum?name=http://en.wikipedia.org/wiki/Alakamisy&image=http://www.flickr.com/photos/weedobooty/7031679837/&quote=http://www.quotationspage.com/quote/1096.html',
  // '<ec2url>/fakealbum?name=http://en.wikipedia.org/wiki/Storm_King_Highway&image=http://www.flickr.com/photos/nikifeijen/7038953389/&quote=http://www.quotationspage.com/quote/23572.html',
  // '<ec2url>/fakealbum?name=http://en.wikipedia.org/wiki/Jewish_cuisine&image=http://www.flickr.com/photos/patrick_castelli/7050134201/&quote=http://www.quotationspage.com/quote/748.html',
  // '<ec2url>/fakealbum?name=http://en.wikipedia.org/wiki/Arab_Media_Forum&image=http://www.flickr.com/photos/leuni/7038775987/&quote=http://www.quotationspage.com/quote/2713.html',
  // '<ec2url>/fakealbum?name=http://en.wikipedia.org/wiki/1823_in_birding_and_ornithology&image=http://www.flickr.com/photos/relle/7041371547/&quote=http://www.quotationspage.com/quote/1474.html'
];
urls.forEach(function (url) {
  extractLinks(url.replace('<ec2url>', ec2url), onDataReady);
});*/
