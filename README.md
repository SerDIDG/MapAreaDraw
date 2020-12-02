Map Area Draw
=============
Easy HTML image map drawing.

Example
------------
```html
<div class="container" id="container">
    <div class="inner" id="inner">
        <canvas id="canvas"></canvas>
        <img src="img/sample.png" alt="Sample Image">
    </div>
</div>
<div class="buttons" id="buttons"></div>
<div class="info" id="info"></div>
```
```javascript
const Draw = new MapAreaDraw();
Draw.render({
    'container': document.getElementById('container'),
    'inner': document.getElementById('inner'),
    'canvas': document.getElementById('canvas'),
    'buttons': document.getElementById('buttons'),
    'info': document.getElementById('info')
});
```

License
------------
[MIT](https://github.com/SerDIDG/MapAreaDraw/blob/master/LICENSE).
