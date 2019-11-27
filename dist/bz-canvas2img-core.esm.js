var Canvas2img = function Canvas2img(width, height) {
  this.width = width;
  this.height = height;
  this.config = { // 图片默认参数
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };
  this._init();
  this.iQueues = []; // 图队列池
  this.tQueues = []; // 字队列池
};

// 初始化参数
Canvas2img.prototype._init = function _init () {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio = context.webkitBackingStorePixelRatio
    || context.mozBackingStorePixelRatio
    || context.msBackingStorePixelRatio
    || context.oBackingStorePixelRatio
    || context.backingStorePixelRatio || 1;
  var ratio = devicePixelRatio / backingStoreRatio;

  canvas.width = this.width * ratio;
  canvas.height = this.height * ratio;
  context.scale(ratio, ratio);
  context.translate(0.5, 0.5);

  this.canvas = canvas;
  this.context = context;
};

// 添加画图队列
Canvas2img.prototype.addImage = function addImage (url, options) {
  var opts = Object.assign({}, this.config, options);
  opts.url = url;
  this.iQueues.push(opts);
};

// 添加画字队列
Canvas2img.prototype.addText = function addText (callback) {
  this.tQueues.push(callback);
};

// 执行绘画
Canvas2img.prototype._startDraw = function _startDraw (queues, callback) {
    var this$1 = this;

  var drawing = function (n) {
    if (n < queues.length) {
      var image = new Image();
      image.setAttribute('crossOrigin', 'Anonymous');
      image.src = queues[n].url;
      image.onload = function () {
        this$1.context.drawImage(image, queues[n].x, queues[n].y, queues[n].width, queues[n].height);
        if (n === queues.length - 1) {
          this$1.tQueues.forEach(function (item) {
            item();
          });
        }
        drawing(n + 1);
      };
    } else {
      this$1._generateBase64(callback);
    }
  };
  drawing(0);
};

// 生成base64
Canvas2img.prototype._generateBase64 = function _generateBase64 (callback) {
  var imgBase64 = this.canvas.toDataURL('image/jpeg');
  callback(imgBase64);
};

// 文字自动换行
Canvas2img.prototype.textPreWrap = function textPreWrap (content, drawX, drawY, lineHeight, lineMaxWidth) {
    var args = [], len = arguments.length - 5;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 5 ];

  var characters = content.split('');
  var template = '';
  var row = [];

  for (var i = 0; i < characters.length + 1; i += 1) {
    var flag = (i === characters.length) ? false : true;
    if (this.context.measureText(template).width < lineMaxWidth && flag) {
      template += characters[i];
    } else {
      row.push(template);
      template = characters[i];
    }
  }

  // 对文字行数限制
  if (args.length > 0 && args[0] < row.length) {
    var num = args[0];
    for (var j = 0; j < num; j += 1) {
      if (j === num - 1) {
        this.context.fillText(((row[j]) + "..."), drawX, drawY + (j + 1) * lineHeight);
      } else {
        this.context.fillText(row[j], drawX, drawY + (j + 1) * lineHeight);
      }
    }
  } else {
    for (var j$1 = 0; j$1 < row.length; j$1 += 1) {
      this.context.fillText(row[j$1], drawX, drawY + (j$1 + 1) * lineHeight);
    }
  }
};

// 绘制图片
Canvas2img.prototype.draw = function draw (callback) {
  if (callback instanceof Function) {
    this._startDraw(this.iQueues, callback);
  } else {
    throw new Error('draw方法接收函数类型的参数');
  }
};

export default Canvas2img;
