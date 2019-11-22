import upload from './axios/axios';
import core from './core';

class Canvas2img extends core {
  drawImage(url, width, height, fn, callback) {
    super.drawImage(url, width, height, fn, (data) => {
      const options = {
        file: data,
      };
      upload(options, callback);
    });
  }
}

export default Canvas2img;
