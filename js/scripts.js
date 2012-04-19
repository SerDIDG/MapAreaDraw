/* ******* Map Area Draw   ******* */
/* ******* @ Serhio Magpie ******* */

/* serdidg@gmail.com      */
/* http://screensider.com */

var Painter = new function(){
	var that = this,
		nodes,
		points = [],
		areas = [];
		
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
		for(var i = 0, l = points.length; i < l; i++){
			_.remove(points[i]['node']);
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
		_.addClass(nodes['container'], 'draw');
		_.addEvent(nodes['canvas'], 'mousedown', addPoint);
		clearBtn();
		saveBtn();
	};
	
	var save = function(){
		_.remove(nodes['clear']);
		_.remove(nodes['save']);
		_.removeClass(nodes['container'], 'draw');
		_.removeEvent(nodes['canvas'], 'mousedown', addPoint);
		addBtn();
		areas.push(_.clone(points));
		renderInfo();
	};
	
	var addPoint = function(e){
		var e = _.getEvent(e),
			offset = _.getOffset(nodes['canvas']),
			x = e.clientX + _.getDocScrollLeft() - offset[0],
			y = e.clientY + _.getDocScrollTop() - offset[1],
			node = nodes['canvas'].appendChild(_.node('div', {'class':'point'}));
			
		node.style.top = y-1+'px';
		node.style.left = x-1+'px';
			
		points.push({'x' : x, 'y' : y, 'node' : node});
		
		e.preventDefault && e.preventDefault();
		return false;
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
			'container' : _.getEl('container'),
			'canvas' : _.getEl('canvas'),
			'buttons' : _.getEl('bar'),
			'info' : _.getEl('info')
		}
		// Render buttons
		clearAllBtn();
		addBtn();
	};
};


window.onload = Painter.init;