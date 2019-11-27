import upload from './axios/axios';
import core from './core';

class Canvas2img extends core {
  constructor(width, height) {
    super(width, height);
  }

  _generateBase64(callback) {
    super._generateBase64((imgBase64) => {
      imgBase64 = imgBase64.replace('data:image/jpeg;base64,', '');
      upload(imgBase64, callback);
    });
  }
}

export default Canvas2img;
