/* ******* Map Area Draw   ******* */
/* ******* @ Serhio Magpie ******* */

/* serdidg@gmail.com      */
/* http://screensider.com */

function getOffset(o) {
    let x = 0,
        y = 0;
    while(o){
        x += o.offsetLeft;
        y += o.offsetTop;
        o = o.offsetParent;
    }
    return [x, y];
}

function getScrollTop() {
    return Math.max(
        document.documentElement.scrollTop,
        document.body.scrollTop,
        0
    );
}

function getScrollLeft() {
    return Math.max(
        document.documentElement.scrollLeft,
        document.body.scrollLeft,
        0
    );
}

function MapAreaDraw() {
    this.styles = {
        point : {
            width: 4,
            fill: 'rgba(0,139,191,0.8)'
        },
        line : {
            width: 1,
            fill: 'rgba(0,172,239,0.2)',
            stroke: 'rgba(0,172,239,0.8)'
        }
    };

    this.nodes = {};
    this.points = [];
    this.areas = [];

    this.addPointBoundHandler = this.addPointHandler.bind(this);
}

MapAreaDraw.prototype.render = function (nodes) {
    this.nodes = nodes;

    this.getCanvas();
    this.renderClearAllButton();
    this.renderAddButtons();
};

MapAreaDraw.prototype.renderClearAllButton = function () {
    this.nodes.clearAllButton = document.createElement('input');
    this.nodes.clearAllButton.type = 'button';
    this.nodes.clearAllButton.value = 'Clear All';
    this.nodes.clearAllButton.addEventListener('click', this.clearAllHandler.bind(this));
    this.nodes.buttons.appendChild(this.nodes.clearAllButton);
};

MapAreaDraw.prototype.clearAllHandler = function () {
    this.points = [];
    this.areas = [];
    this.clear();
    this.clearCanvas();
};

MapAreaDraw.prototype.clear = function () {
    this.nodes.container.classList.remove('draw');
    this.nodes.inner.removeEventListener('mousedown', this.addPointBoundHandler);
    this.clearInfo();
    this.removeAddButtons();
    this.removeSaveButton();
    this.renderAddButtons();
};

MapAreaDraw.prototype.renderAddButtons = function () {
    this.nodes.addPolyButton = document.createElement('input');
    this.nodes.addPolyButton.type = 'button';
    this.nodes.addPolyButton.value = 'Add Poly Area';
    this.nodes.addPolyButton.addEventListener('click', this.addPolyHandler.bind(this));
    this.nodes.buttons.appendChild(this.nodes.addPolyButton);

    this.nodes.addRectButton = document.createElement('input');
    this.nodes.addRectButton.type = 'button';
    this.nodes.addRectButton.value = 'Add Rect Area';
    this.nodes.addRectButton.addEventListener('click', this.addRectHandler.bind(this));
    this.nodes.buttons.appendChild(this.nodes.addRectButton);
};

MapAreaDraw.prototype.removeAddButtons = function () {
    this.nodes.addPolyButton.remove();
    this.nodes.addRectButton.remove();
};

MapAreaDraw.prototype.addPolyHandler = function () {
    this._areaType = 'poly';
    this.nodes.container.classList.add('draw');
    this.nodes.inner.addEventListener('mousedown', this.addPointBoundHandler);
    this.removeAddButtons();
    this.renderSaveButton();
};

MapAreaDraw.prototype.addRectHandler = function () {
    this._areaType = 'rect';
    this.nodes.container.classList.add('draw');
    this.nodes.inner.addEventListener('mousedown', this.addPointBoundHandler);
    this.removeAddButtons();
    this.renderSaveButton();
};

MapAreaDraw.prototype.renderSaveButton = function () {
    this.nodes.saveButton = document.createElement('input');
    this.nodes.saveButton.type = 'button';
    this.nodes.saveButton.value = 'Save Area';
    this.nodes.saveButton.addEventListener('click', this.saveHandler.bind(this));
    this.nodes.buttons.appendChild(this.nodes.saveButton);
};

MapAreaDraw.prototype.removeSaveButton = function () {
    this.nodes.saveButton.remove();
};

MapAreaDraw.prototype.saveHandler = function () {
    let _points;
    if (this._areaType === 'rect' && this.points.length === 2) {
        let _normalize = this.normalizeRectPoints(this.points);
        _points = [
            {x: _normalize.x1, y: _normalize.y1},
            {x: _normalize.x2, y: _normalize.y2}
        ];
    } else {
        _points = [].slice.call(this.points);
    }

    this.areas.push({
        'type' : this._areaType,
        'points' : _points
    });
    this.points = [];
    this.clear();
    this.renderInfo();
};

MapAreaDraw.prototype.addPointHandler = function (event) {
    event.preventDefault();

    if (
        (this._areaType === 'rect' || this._areaType === 'circle') &&
        this.points.length === 2
    ) {
        return ;
    }

    let offset = getOffset(this.nodes.inner),
        x = event.clientX + getScrollLeft() - offset[0],
        y = event.clientY + getScrollTop() - offset[1];
    this.points.push({x: x, y: y});

    this.draw();
};

MapAreaDraw.prototype.draw = function () {
    const that = this;
    this.clearCanvas();
    this.areas.forEach(function (area) {
        that.drawPoints(area.points, area.type)
    });
    this.drawPoints(this.points, this._areaType);
};

MapAreaDraw.prototype.drawPoints = function (points, type) {
    const that = this;

    // Normalize points
    let _points;
    if (type === 'rect' && points.length === 2) {
        let _normalize = this.normalizeRectPoints(points);
        _points = [
            {x: _normalize.x1, y: _normalize.y1},
            {x: _normalize.x2, y: _normalize.y1},
            {x: _normalize.x2, y: _normalize.y2},
            {x: _normalize.x1, y: _normalize.y2}
        ];
    } else {
        _points = points
    }

    // Draw lines
    this.context.fillStyle = this.styles.line.fill;
    this.context.lineWidth = this.styles.line.width;
    this.context.strokeStyle = this.styles.line.stroke;
    this.context.beginPath();
    _points.forEach(function (point, i) {
        if (i === 0) {
            that.context.moveTo(point.x, point.y);
        } else {
            that.context.lineTo(point.x, point.y);
        }
    });
    this.context.closePath();
    this.context.fill();
    this.context.stroke();

    // Draw points
    this.context.fillStyle = this.styles.point.fill;
    _points.forEach(function (point) {
        that.context.fillRect(
            point.x - (that.styles.point.width / 2),
            point.y - (that.styles.point.width / 2),
            that.styles.point.width,
            that.styles.point.width
        );
    });
};

MapAreaDraw.prototype.renderInfo = function () {
    const that = this;
    let node, results;

    node = document.createElement('div');
    node.innerText = '<map>';
    this.nodes.info.appendChild(node);

    this.areas.forEach(function (area) {
        if (area.points.length > 0) {
            results = '<area shape="' + area.type + '" coords="';
            area.points.forEach(function (point, i) {
                if (i > 0) {
                    results += ',';
                }
                results += point.x + ',' + point.y;
            });
            results += '">';

            node = document.createElement('div');
            node.innerText = results;
            that.nodes.info.appendChild(node);
        }
    });

    node = document.createElement('div');
    node.innerText = '</map>';
    this.nodes.info.appendChild(node);
};

MapAreaDraw.prototype.clearInfo = function () {
    while (this.nodes.info.firstChild) {
        this.nodes.info.firstChild.remove();
    }
};

MapAreaDraw.prototype.getCanvas = function () {
    this.nodes.canvas.width = this.nodes.inner.offsetWidth;
    this.nodes.canvas.height = this.nodes.inner.offsetHeight;
    this.context = this.nodes.canvas.getContext('2d');
};

MapAreaDraw.prototype.clearCanvas = function () {
    this.context.clearRect(0, 0, this.nodes.canvas.width, this.nodes.canvas.height);
};

MapAreaDraw.prototype.normalizeRectPoints = function(points) {
    return {
        x1: Math.min(points[0].x, points[1].x),
        y1: Math.min(points[0].y, points[1].y),
        x2: Math.max(points[0].x, points[1].x),
        y2: Math.max(points[0].y, points[1].y)
    }
};

window.addEventListener('load', function() {
    const Draw = new MapAreaDraw();
    Draw.render({
        'container': document.getElementById('container'),
        'inner': document.getElementById('inner'),
        'canvas': document.getElementById('canvas'),
        'points': document.getElementById('points'),
        'buttons': document.getElementById('bar'),
        'info': document.getElementById('info'),
    });
});
