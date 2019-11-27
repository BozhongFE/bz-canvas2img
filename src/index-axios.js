import upload from './axios/axios';
import core from './core';

class Canvas2img extends core {
  constructor(width, height) {
    super(width, height);
  }

  _generateBase64(callback) {
    super._generateBase64((data) => {
      upload(data, callback);
    });
  }
}

export default Canvas2img;
