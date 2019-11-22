# bz-canvas2img

播种网canvas合成图片模块

## 打包

``` js
npm run build
```

## 接口

### Canvas2img

Canvas2img 是一个构造函数

#### Function

- **drawImage(url, width, height, fn, callback)**

  - fn

    返回两个参数供外部使用，第一个是context，第二个是canvas

  | 参数     | 类型             | 说明                                                         |
  | -------- | ---------------- | ------------------------------------------------------------ |
  | url      | string（必选）   | 本地和线上路径都可以                                         |
  | width    | number（必选）   | 图片的宽度，传入375设计稿的宽度                              |
  | height   | number（必选）   | 图片的高度，传入375设计稿的高度                              |
  | fn       | function（必选） | 外部写字的方法，两个参数：第一个是context，第二个是canvas；如果不需要，传入null |
  | callback | function（必选） | 根据使用方式，如果是使用axios加载，即返回图片url；如果是外部做请求处理，即返回图片的base64 |

## Example

### axios用法

``` js
const canvas2img = new Canvas2img();

const drawText = (context, canvas) => {
  // ...
}

canvas2img.drawImage(url, 250, 444, drawText, function (data) {
   const $img = document.getElementById('img');
   $img.src = data;
});
```

### 外部做请求处理

``` js
import BzAxios from 'bz-axios';
import BzLogin from 'bz-login';

const api = new BzAxios({
  base64: `https:${BzLogin.getLink('upfile')}/upload_base64.php`,
});

const canvas2img = new Canvas2img();

const drawText = (context, canvas) => {
  // ...
}

canvas2img.drawImage(url, 250, 444, drawText, function (data) {
  const $img = document.getElementById('img');
  api.base64({
    type: 'post',
    data: {
      class: 'user',
      contentType: 'image/jpeg',
      file: data,
    },
    success(data) {
      $img.src = data.data.url;  
    },
    error(err) {
      console.log(err);
    }
  });
});
```

