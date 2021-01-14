class Canvas2img {
  constructor(width, height) {
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
  }

  // 初始化参数
  _init() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = context.webkitBackingStorePixelRatio
      || context.mozBackingStorePixelRatio
      || context.msBackingStorePixelRatio
      || context.oBackingStorePixelRatio
      || context.backingStorePixelRatio || 1;
    const ratio = devicePixelRatio / backingStoreRatio;

    canvas.width = this.width * ratio;
    canvas.height = this.height * ratio;
    context.scale(ratio, ratio);
    context.translate(0.5, 0.5);

    this.canvas = canvas;
    this.context = context;
  }

  // 添加画图队列
  addImage(url, options, callback) {
    const opts = Object.assign({}, this.config, options);
    opts.url = url;
    opts.handle = callback;
    this.iQueues.push(opts);
  }

  // 添加画字队列
  addText(callback) {
    this.tQueues.push(callback);
  }

  // 执行绘画
  _startDraw(queues, callback) {
    const drawing = (n) => {
      if (n < queues.length) {
        const image = new Image();
        image.setAttribute('crossOrigin', 'Anonymous');
        image.src = queues[n].url;
        const handle = queues[n].handle;
        const imgbase = {
          x: queues[n].x,
          y: queues[n].y,
          width: queues[n].width,
          height: queues[n].height
        };
        image.onload = () => {
          handle && handle(imgbase);
          this.context.save();
          this.context.drawImage(image, queues[n].x, queues[n].y, queues[n].width, queues[n].height);
          this.context.restore();
          if (n === queues.length - 1) {
            this.tQueues.forEach((item) => {
              item();
            });
          }
          drawing(n + 1);
        };
      } else {
        this._generateBase64(callback);
      }
    };
    drawing(0);
  }

  // 生成base64
  _generateBase64(callback) {
    let imgBase64 = this.canvas.toDataURL('image/jpeg');
    callback(imgBase64);
  }

  // 文字自动换行
  textPreWrap(content, drawX, drawY, lineHeight, lineMaxWidth, ...args) {
    const characters = content.split('');
    let template = '';
    const row = [];

    for (let i = 0; i < characters.length + 1; i += 1) {
      const flag = (i === characters.length) ? false : true;
      if (this.context.measureText(template).width < lineMaxWidth && flag) {
        template += characters[i];
      } else {
        row.push(template);
        template = characters[i];
      }
    }

    // 对文字行数限制
    if (args.length > 0 && args[0] < row.length) {
      const num = args[0];
      for (let j = 0; j < num; j += 1) {
        if (j === num - 1) {
          this.context.fillText(`${row[j]}...`, drawX, drawY + (j + 1) * lineHeight);
        } else {
          this.context.fillText(row[j], drawX, drawY + (j + 1) * lineHeight);
        }
      }
    } else {
      for (let j = 0; j < row.length; j += 1) {
        this.context.fillText(row[j], drawX, drawY + (j + 1) * lineHeight);
      }
    }
  }

  // 绘制图片
  draw(callback) {
    if (callback instanceof Function) {
      this._startDraw(this.iQueues, callback);
    } else {
      throw new Error('draw方法接收函数类型的参数');
    }
  }
}

export default Canvas2img;
