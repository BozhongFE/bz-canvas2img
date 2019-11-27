# bz-canvas2img

播种网canvas合成图片模块

## 打包

``` js
npm run build
```

## 接口

### Canvas2img

Canvas2img 是一个canvas 合成图片的构造函数。

【注意，模块是按照 **375** 来设计的，即传入得数值或外部写的数值，都是设计稿 **750**  的一半】

#### 传入参数

| 参数   | 类型           | 说明               |
| ------ | -------------- | ------------------ |
| width  | number（必选） | 设置 canvas 的宽度 |
| height | number（必选） | 设置 canvas 的高度 |

``` js
const canvas2img = new Canvas2img(width, height);
```

#### 全局属性

实例化对象，可以供外部调用全局属性。

| 参数    | 说明                                                         |
| ------- | ------------------------------------------------------------ |
| context | context 对象（上下文对象），Canvas API 定义在这个context 对象上面 |
| canvas  | canvas 对象，可以获取`canvas.width` 、`canvas.height` ，如：做文字居中处理`canvas.width / 4` |

#### 实例方法

实例化对象，调用方法。

##### addImage(url, options)

添加画图参数。

| 参数    | 类型           | 说明                           |
| ------- | -------------- | ------------------------------ |
| url     | string（必选） | 图像的路径，本地或线上的都可以 |
| options | object（必选） | 包含画图的四个参数             |

- options 四个参数

  | 参数   | 类型                      | 说明                         |
  | ------ | ------------------------- | ---------------------------- |
  | x      | number（可选），默认为0   | 在画布上放置图像的x 坐标位置 |
  | y      | number（可选），默认为0   | 在画布上放置图像的y 坐标位置 |
  | width  | number（可选），默认为100 | 要使用的图像的宽度           |
  | height | number（可选），默认为100 | 要使用的图像的高度           |

##### addText(callback)

添加画字方法。

| 参数     | 类型             | 说明       |
| -------- | ---------------- | ---------- |
| callback | function（必选） | 画字的方法 |

##### textPreWrap(content, drawX, drawY, lineHeight, lineMaxWidth, lineNum)

绘制文字时，提供了一个文字自动换行方法，方便对文字统一需求的使用。

【注意】如果不填`lineNum` 参数，会显示全部文本，如果填的`lineNum` 参数大于文本总行数，也会显示全部文本，如果填的`lineNum` 参数小于文本总行数，这后面的会用`...` 省略掉

| 参数         | 类型           | 说明                     |
| ------------ | -------------- | ------------------------ |
| content      | string（必选） | 规定在画布上输出的文本   |
| drawX        | number（必选） | 开始绘制文本的x 坐标位置 |
| drawY        | number（必选） | 开始绘制文本的y 坐标位置 |
| lineHeight   | number（必选） | 文本之间的行高           |
| lineMaxWidth | number（必选） | 允许的最大文本宽度       |
| lineNum      | number（可选） | 允许最多绘制的行数       |

##### draw(callback)

执行绘制图片。

| 参数     | 类型             | 说明                              |
| -------- | ---------------- | --------------------------------- |
| callback | function（必选） | 执行绘制图片，并返回base64或者url |

## 使用

### Using npm

``` js
npm install https://github.com/BozhongFE/bz-canvas2img#v0.1.0
```

``` js
// 引用方式1：依赖axios
import Canvas2img from 'bz-canvas2img/dist/bz-canvas2img-axios.esm.js'
// 引用方式2：无依赖，需要自行去请求接口转换成图片
import Canvas2img from 'bz-canvas2img/dist/bz-canvas2img-core.esm.js'
```

## Example

``` html
<img id="img">
```

``` js
// 依赖axios
import Canvas2img from 'bz-canvas2img/dist/bz-canvas2img-axios.esm.js';

const canvas2img = new Canvas2img(300, 400);
const context = canvas2img.context;
const canvas = canvas2img.canvas;

canvas2img.addImage(require('../assets/img/logo.png'), {x: 200, y: 0, width: 100, height: 100});
canvas2img.addImage(require('../assets/img/code.jpg'), {x: 100, y: 300, width: 100, height: 100});
canvas2img.addText(() => {
  context.font = '20px Arial';
  context.fillStyle = "#5e130e";
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const t = '婕拉山东矿机阿斯利利利大时代尽快哈市的金卡和达康书记德哈卡加大号是侃大山';
  canvas2img.textPreWrap(t, canvas.width / 4, 80, 30, 200, 5);
});
canvas2img.draw((data) => {
  const $img = document.getElementById('img');
  $img.src = data;
});
```

``` js
// 无依赖
import Canvas2img from 'bz-canvas2img/dist/bz-canvas2img-core.esm.js';

import BzAxios from 'bz-axios';
import BzLogin from 'bz-login';

const api = new BzAxios({
  base64: `https:${BzLogin.getLink('upfile')}/upload_base64.php`,
});

const canvas2img = new Canvas2img(300, 400);
const context = canvas2img.context;
const canvas = canvas2img.canvas;

canvas2img.addImage(require('../assets/img/logo.png'), {x: 200, y: 0, width: 100, height: 100});
canvas2img.addImage(require('../assets/img/code.jpg'), {x: 100, y: 300, width: 100, height: 100});
canvas2img.addText(() => {
  context.font = '20px Arial';
  context.fillStyle = "#5e130e";
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const t = '婕拉山东矿机阿斯利利利大时代尽快哈市的金卡和达康书记德哈卡加大号是侃大山';
  canvas2img.textPreWrap(t, canvas.width / 4, 80, 30, 200, 5);
});
canvas2img.draw((data) => {
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
});
```

