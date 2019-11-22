import axios from 'axios';
import qs from 'qs';

var getLink = function (prefix, productPrefix) {
  var ref = window.location;
  var host = ref.host;
  var prodPrefix = productPrefix || prefix;
  if (host.indexOf('office') !== -1) {
    return ("//" + prefix + ".office.bzdev.net");
  }
  if (host.indexOf('online') !== -1) {
    return ("//" + prefix + ".online.seedit.cc");
  }
  return ("//" + prodPrefix + ".bozhong.com");
};

var api = {
  base64: ("https:" + (getLink('upfile')) + "/upload_base64.php"),
};

var upload = function (options, callback) {
  axios.post(api.base64,
    qs.stringify({
      class: 'user',
      contentType: 'image/jpeg',
      file: options.file,
    }))
    .then(function (response) {
      callback(response.data.data.url);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var Canvas2img = function Canvas2img () {};

Canvas2img.prototype.drawImage = function drawImage (url, width, height, fn, callback) {
    var this$1 = this;

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio = context.webkitBackingStorePixelRatio
    || context.mozBackingStorePixelRatio
    || context.msBackingStorePixelRatio
    || context.oBackingStorePixelRatio
    || context.backingStorePixelRatio || 1;
  var ratio = devicePixelRatio / backingStoreRatio;
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  var image = new Image();
  image.setAttribute('crossOrigin', 'Anonymous');
  image.src = url;    
  image.onload = function () {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    // 调用画笔，注意这一步需要在canvas.toDataURL前面完成，不然不会渲染
    if (fn instanceof Function) {
      this$1.drawText(fn, context, canvas);
    }
    var imgBase64 = canvas.toDataURL('image/jpeg');
    imgBase64 = imgBase64.replace('data:image/jpeg;base64,', '');
    callback(imgBase64);
  };
};

// 写字
Canvas2img.prototype.drawText = function drawText (callback, context, canvas) {
  callback(context, canvas);
};

var Canvas2img$1 = /*@__PURE__*/(function (core) {
  function Canvas2img () {
    core.apply(this, arguments);
  }

  if ( core ) Canvas2img.__proto__ = core;
  Canvas2img.prototype = Object.create( core && core.prototype );
  Canvas2img.prototype.constructor = Canvas2img;

  Canvas2img.prototype.drawImage = function drawImage (url, width, height, fn, callback) {
    core.prototype.drawImage.call(this, url, width, height, fn, function (data) {
      var options = {
        file: data,
      };
      upload(options, callback);
    });
  };

  return Canvas2img;
}(Canvas2img));

export default Canvas2img$1;
