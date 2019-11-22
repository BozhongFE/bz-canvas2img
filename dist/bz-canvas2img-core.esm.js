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

export default Canvas2img;
