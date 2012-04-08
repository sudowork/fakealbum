Canvas = require('canvas');
Image = Canvas.Image;

var rgba = function (r, g, b, a) {
    return {
        r: r,
        g: g,
        b: b,
        a: a
    };
},
getPixel = function (imagedata, x, y) {
    var data = imagedata.data,
        position = (x + imagedata.width * y) * 4;
    return rgba(
        data[position],
        data[position + 1],
        data[position + 2],
        data[position + 3]
    );
},
setPixel = function (imagedata, x, y, color) {
    var position = (x + imagedata.width * y) * 4;
    imagedata.data[position] = color.r;
    imagedata.data[position + 1] = color.g;
    imagedata.data[position + 2] = color.b;
    imagedata.data[position + 3] = color.a;
},
getRow = function (imagedata, r) {
    var position = (imagedata.width * r) * 4,
        data = imagedata.data,
        row = new Array(imagedata.width),
        end = imagedata.width,
        i;
    for (i = 0; i < end; position += 4, i += 1) {
        row[i] = rgba(
            data[position],
            data[position + 1],
            data[position + 2],
            data[position + 3]
        );
    }
    return row;
},
getColumn = function (imagedata, c) {
    var position = c * 4,
        data = imagedata.data,
        column = new Array(imagedata.height),
        inc = imagedata.width * 4,
        end = imagedata.height,
        i;
    for (i = 0; i < end; position += inc, i += 1) {
        column[i] = rgba(
            data[position],
            data[position + 1],
            data[position + 2],
            data[position + 3]
        );
    }
    return column;
},
gray = function (imagedata, i, j) {
  var color = getPixel(imagedata, i, j);
  return 0.2989*color.r + 0.5870*color.g + 0.1140*color.b;
},
grayToRGB = function (gray) {
  return rgba(gray, gray, gray, 255);
},
rgbToHsl = function(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
      h: h,
      s: s,
      l: l
    };
},
hslToRgb = function (h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return rgba(r * 255, g * 255, b * 255, 255);
},

componentToHex = function (c) {
    var hex = Math.round(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
},

rgbToHex = function(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

module.exports = function(path,callback) {
  var img = new Image;

  img.onload = function(){
    var width = img.width
      , height = img.height
      , canvas = new Canvas(width, height)
      , ctx = canvas.getContext('2d')
      , i
      , j;

    ctx.drawImage(img, 0, 0);
    var imgData = ctx.getImageData(0, 0, width, height);

    // Edge Detection
    edges = new Array(width * height);
    for (i = width - 2; i >= 1; i--) {
      for (j = height - 2; j >= 1; j--) {
        var val = -6*gray(imgData, i, j);
        val = val + gray(imgData, i-1,j) + gray(imgData, i+1,j) + gray(imgData, i,j-1) + gray(imgData, i,j+1);
        val = val + 0.5*( gray(imgData, i-1,j-1) + gray(imgData, i+1,j-1) + gray(imgData, i-1,j+1) + gray(imgData, i+1,j+1) );
        edges[i + j * width] = Math.abs(val);
      }
    }

    // Region
    var sums = new Array(height),
        sum = 0;
    for (j = height - 2; j >= 1; j--) {
      sum = 0;
      for (i = width - 2; i >= 1; i--) {
        sum += edges[i + j * width];
      }
      sums[j] = sum;
    }

    // Moving average
    var averages = new Array(height);
    // Range must be odd
    var range = 101;
    var halfrange = (range-1)/2;
    minavg = 9999999999999,
    minindex = -1;
    for (i = halfrange; i <= height - halfrange - 1; i++) {
      sum = 0;
      for (j = i-halfrange; j <= i+halfrange; j++) {
        sum += sums[j];
      }
      averages[i] = sum/range;
      if (averages[i] < minavg) {
        minavg = averages[i];
        minindex = i;
      }
    }

    var hue = 0,
    lightness = 0,
    saturation = 0,
    color;
    for (j = minindex-halfrange; j <= minindex+halfrange; j++) {
      for (i = width - 1; i >= 0; i--) {
        color = getPixel(imgData, i, j);
        colorhsl = rgbToHsl(color.r, color.g, color.b);
        hue += colorhsl.h;
        lightness += colorhsl.l;
        saturation += colorhsl.h;
      }
    }
    hue /= (range * width);
    lightness /= (range * width);
    saturation /= (range * width);

    idealColor = hslToRgb((hue+0.5)%1, saturation, 1-lightness);
    callback(minindex,rgbToHex(idealColor.r,idealColor.g,idealColor.b));
  };

  img.src = path;
}
