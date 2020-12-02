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
        <div class="points" id="points"></div>
    </div>
</div>
<div class="bar" id="bar"></div>
<div class="info" id="info"></div>
```
```javascript
const Draw = new MapAreaDraw();
Draw.render({
    'container': document.getElementById('container'),
    'inner': document.getElementById('inner'),
    'canvas': document.getElementById('canvas'),
    'points': document.getElementById('points'),
    'buttons': document.getElementById('bar'),
    'info': document.getElementById('info'),
});
```

License
------------
[MIT](https://github.com/SerDIDG/MapAreaDraw/blob/master/LICENSE).
