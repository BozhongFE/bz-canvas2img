import axios from 'axios';
import qs from 'qs';
import apiList from '../api';

const upload = (file, callback) => {
  axios.post(apiList.base64,
    qs.stringify({
      class: 'user',
      contentType: 'image/jpeg',
      file: file,
    }))
    .then((response) => {
      callback(response.data.data.url);
    })
    .catch((error) => {
      console.log(error);
    });
};

export default upload;
