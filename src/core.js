class Canvas2img {
  // 画图
  drawImage(url, width, height, fn, callback) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = context.webkitBackingStorePixelRatio
      || context.mozBackingStorePixelRatio
      || context.msBackingStorePixelRatio
      || context.oBackingStorePixelRatio
      || context.backingStorePixelRatio || 1;
    const ratio = devicePixelRatio / backingStoreRatio;
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    const image = new Image();
    image.setAttribute('crossOrigin', 'Anonymous');
    image.src = url;    
    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      // 调用画笔，注意这一步需要在canvas.toDataURL前面完成，不然不会渲染
      if (fn instanceof Function) {
        this.drawText(fn, context, canvas);
      }
      let imgBase64 = canvas.toDataURL('image/jpeg');
      imgBase64 = imgBase64.replace('data:image/jpeg;base64,', '');
      callback(imgBase64);
    };
  }

  // 写字
  drawText(callback, context, canvas) {
    callback(context, canvas);
  }
}

export default Canvas2img;
