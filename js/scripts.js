/* ******* Map Area Draw   ******* */
/* ******* @ Serhio Magpie ******* */

/* serdidg@gmail.com      */
/* http://screensider.com */

var Painter = new function(){
	var that = this,
		isCanvas = false,
		nodes,
		context,
		points = [],
		areas = [];
		
	var checkCanvas = function(){
		if(nodes['canvas'].getContext){
			isCanvas = true;
			nodes['canvas'].width = nodes['draw'].offsetWidth;
			nodes['canvas'].height = nodes['draw'].offsetHeight;
			context = nodes['canvas'].getContext('2d');
		}else{
			_.remove(nodes['canvas']);
		}
	};
	
	var clearAllBtn = function(){
		nodes['clear_all'] = nodes['buttons'].appendChild(_.node('input', {'type':'button', 'value':'Clear All'}));
		nodes['clear_all'].onclick = clearAll;
	};
		
	var addBtn = function(){
		nodes['add'] = nodes['buttons'].appendChild(_.node('input', {'type':'button', 'value':'Add Area'}));
		nodes['add'].onclick = add;
	};
	
	var saveBtn = function(){
		nodes['save'] = nodes['buttons'].appendChild(_.node('input', {'type':'button', 'value':'Save Area'}));
		nodes['save'].onclick = save;
	};
	
	var clearAll = function(){
		clear();
		_.clearNode(nodes['info']);
		points = [];
		areas = [];
		// Clear preview from points or canvas
		if(isCanvas){
			clearCanvas();
		}else{
			clearPoints();
		}
	};
		
	var add = function(){
		_.remove(nodes['add']);
		_.addClass(nodes['preview'], 'draw');
		_.addEvent(nodes['draw'], 'mousedown', addPoint);
		// Render buttons
		saveBtn();
	};
	
	var save = function(){
		clear();
		areas.push(_.clone(points));
		points = [];
		renderInfo();
	};
	
	var clear = function(){
		_.remove(nodes['add']);
		_.remove(nodes['save']);
		_.removeClass(nodes['preview'], 'draw');
		_.removeEvent(nodes['draw'], 'mousedown', addPoint);
		addBtn();
	}
	
	var clearCanvas = function(){
		context.clearRect(0, 0, nodes['canvas'].width, nodes['canvas'].height);
	};
	
	var clearPoints = function(){
		_.clearNode(nodes['points']);
	};
	
	var addPoint = function(e){
		var e = _.getEvent(e),
			offset = _.getOffset(nodes['draw']),
			x = e.clientX + _.getDocScrollLeft() - offset[0],
			y = e.clientY + _.getDocScrollTop() - offset[1];
		// Push point to area array
		points.push({'x' : x, 'y' : y});
		// Draw point
		if(isCanvas){
			drawCanvasAll();
		}else{
			drawHtmlPoint(x,y);
		}
		// Prevent drag event
		e.preventDefault && e.preventDefault();
		return false;
	};
	
	var drawHtmlPoint = function(x, y){
		var node = nodes['points'].appendChild(_.node('div', {'class':'point'}));
		node.style.top = y-1+'px';
		node.style.left = x-1+'px';
	};
	
	var drawCanvasPoints = function(o){
		// Draw lines
		context.fillStyle = 'rgba(0,172,239,0.2)';
		context.lineWidth = 1;
		context.strokeStyle = 'rgba(0,172,239,0.8)';
		context.beginPath();
		for(var i = 0, l = o.length; i < l; i++){
			if(i == 0){
				context.moveTo(o[i]['x'], o[i]['y']);
			}else{
				context.lineTo(o[i]['x'], o[i]['y']);
			}
		}
		context.closePath();
		context.fill();
		context.stroke();
		// Draw points
		context.fillStyle = 'rgba(0,139,191,0.8)';
		for(var i = 0, l = o.length; i < l; i++){
			context.fillRect(o[i]['x']- 2, o[i]['y']- 2, 4, 4);
		}
	};
	
	var drawCanvasAll = function(){
		clearCanvas();
		// Draw saved areas
		for(var i = 0, l = areas.length; i < l; i++){
			drawCanvasPoints(areas[i]);
		}
		// Draw current area
		drawCanvasPoints(points);
	};
	
	var renderInfo = function(){
		var text;
		
		_.clearNode(nodes['info']);
		
		nodes['info'].appendChild(_.node('span', '<map>'));
		nodes['info'].appendChild(_.node('br'));
		
		for(var i = 0, l = areas.length; i < l; i++){
			if(areas[i].length > 0){
				text = '<area shape="poly" coords="';
					for(var i2 = 0, l2 = areas[i].length; i2 < l2; i2++){
						if(i2 > 0){
							text += ',';
						}
						text += areas[i][i2]['x'] + ',' + areas[i][i2]['y'];
					}
				text += '">';
				nodes['info'].appendChild(_.node('span', text));
				nodes['info'].appendChild(_.node('br'));
			}
		}
		
		nodes['info'].appendChild(_.node('span', '</map>'));
	};
	
	that.init = function(){
		nodes = {
			'preview' : _.getEl('preview'),
			'draw' : _.getEl('draw'),
			'canvas' : _.getEl('canvas'),
			'points' : _.getEl('points'),
			'buttons' : _.getEl('bar'),
			'info' : _.getEl('info')
		}
		// Init Canvas
		checkCanvas();
		// Render buttons
		clearAllBtn();
		addBtn();
	};
};


window.onload = Painter.init;