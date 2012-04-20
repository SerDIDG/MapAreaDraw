/* ******* Map Area Draw   ******* */
/* ******* @ Serhio Magpie ******* */

/* serdidg@gmail.com      */
/* http://screensider.com */

var Painter = new function(){
	var that = this,
		isCanvas = false,
		nodes,
		points = [],
		areas = [];
		
	var checkCanvas = function(){
		if(nodes['canvas'].getContext){
			isCanvas = true;
			nodes['canvas'].width = nodes['draw'].offsetWidth;
			nodes['canvas'].height = nodes['draw'].offsetHeight;
		}else{
			_.remove(nodes['canvas']);
		}
	};
		
	var clearBtn = function(){
		nodes['clear'] = nodes['buttons'].appendChild(_.node('input', {'type':'button', 'value':'Clear'}));
		nodes['clear'].onclick = clear;
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
	
	var clear = function(){
		if(!isCanvas){
			for(var i = 0, l = points.length; i < l; i++){
				_.remove(points[i]['node']);
			}
		}
		points = [];
	};
	
	var clearAll = function(){
		_.clearNode(nodes['info']);
		clear();
		areas = [];
	};
		
	var add = function(){
		clear();
		_.remove(nodes['add']);
		_.addClass(nodes['preview'], 'draw');
		_.addEvent(nodes['draw'], 'mousedown', addPoint);
		// Render buttons
		clearBtn();
		saveBtn();
	};
	
	var save = function(){
		_.remove(nodes['clear']);
		_.remove(nodes['save']);
		_.removeClass(nodes['preview'], 'draw');
		_.removeEvent(nodes['draw'], 'mousedown', addPoint);
		addBtn();
		areas.push(_.clone(points));
		renderInfo();
	};
	
	var addPoint = function(e){
		var e = _.getEvent(e),
			offset = _.getOffset(nodes['draw']),
			x = e.clientX + _.getDocScrollLeft() - offset[0],
			y = e.clientY + _.getDocScrollTop() - offset[1];
		
		if(isCanvas){
			addCanvasPoint(x,y);
		}else{
			addHtmlPoint(x,y);
		}
		
		e.preventDefault && e.preventDefault();
		return false;
	};
	
	var addHtmlPoint = function(x, y){
		var node = nodes['draw'].appendChild(_.node('div', {'class':'point'}));
		node.style.top = y-1+'px';
		node.style.left = x-1+'px';
		// Push point to area array
		points.push({'x' : x, 'y' : y, 'node' : node});
	};
	
	var addCanvasPoint = function(x, y){
		var prev = points[points.length-1],
			line;
		
		if(points.length > 0){
			line = nodes['canvas'].getContext('2d');
			// Style
			line.strokeStyle = 'rgb(0,172,239)';
			line.fillStyle = 'rgba(0,172,239,0.8)';
			line.lineWidth = 2;
			// Draw
			line.beginPath();
			if(prev){
				line.moveTo(prev['x'], prev['y']);
			}
			line.lineTo(x, y);
			line.stroke();
			line.closePath();
		}
		// Push point to area array
		points.push({'x' : x, 'y' : y});
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