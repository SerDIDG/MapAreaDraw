/* ******* Express Common Library ******* */
/* ******* @ Serhio Magpie        ******* */

/* serdidg@gmail.com      */
/* http://screensider.com */

_ = {
	'IE6' : !(navigator.appVersion.indexOf("MSIE 6.")==-1),
	'IE7' : !(navigator.appVersion.indexOf("MSIE 7.")==-1),
	'IE8' : !(navigator.appVersion.indexOf("MSIE 8.")==-1),
	'IE9' : !(navigator.appVersion.indexOf("MSIE 9.")==-1)
};

/* ******* OBJECTS AND ARRAYS ******* */

_.isArray = Array.isArray || function(obj){return (obj)? obj.constructor == Array : false; };
_.isRegExp = function(obj){return obj.constructor == RegExp; };
_.isEmpty = function(el, type){
	switch(type){
		case 'string':
		default:
			return !el || el == null || el.length == 0;
		break
	}
};
_.toFixed = function(n, x){ return	parseFloat(n).toFixed(x); };
_.toNumber = function(str){ return parseInt(str.replace(/\s+/, '')); }

_.makeArray = function(o){
	var arr = []; for(var key in o){ if(o.hasOwnProperty(key)){ arr.push(o[key]); } } return arr;
};
_.makeObject = function(o){
	var obj = {}; for(var i = 0; i<o.length; i++){ obj[o[i]] = o[i]; } return obj;
};
_.merge = function(o1, o2){
	var o1 = (o1)? _.clone(o1) : {};
	for(var key in o2){
		if(o2[key] != null && o2.hasOwnProperty(key)){
			try{
				if(o2[key].constructor == Object){
					o1[key] = _.merge(o1[key], o2[key]);
				}else{
					o1[key] = o2[key];
				}
			}catch(e){
				o1[key] = o2[key];
			}
		}
  	}
	return o1;
};
_.clone = function(obj){
	if(!obj){
		var o = obj;
	}else if(_.isArray(obj)){
		var o = [];
		for(var i = 0; i<obj.length; i++){ if(typeof obj[i] == 'object'){ o.push(_.clone(obj[i])); }else{ o.push(obj[i]); } }
	}else if(_.isRegExp(obj)){
		var o = obj;
	}else if(obj.nodeType){
		var o = obj;
	}else{
		var o = {};
		for(var i in obj){ if(obj.hasOwnProperty(i)){ if(typeof obj[i] == 'object'){o[i] = _.clone(obj[i]);} else{o[i] = obj[i];} } }
	}
	return o;
};
_.count = function(o){
	var i = 0;
	for(var key in o){ if(o.hasOwnProperty(key)){ i++; } }
	return i;
};


/* ******* EVENTS ******* */

_.isCenterButton = function(e){
	var e = _.getEvent(e);
	return e.button == ((_.IE8 || _.IE7)? 4 : 1);
};
_.addEvent = function(elem, type, handler){
	try{ elem.addEventListener(type, handler, false); }catch(e){ elem.attachEvent("on"+type, handler); }
};
_.removeEvent = function(elem, type, handler){
	try{ elem.removeEventListener(type, handler, false); }catch(e){ elem.detachEvent("on"+type, handler); }
};
_.getEvent = function(e){
	return e || window.event;
};
_.getTarget = function(e){
	var e = _.getEvent(e);
	return e.target || e.srcElement
};

/* ******* NODES ******* */

_.getEl = function(str){
	return document.getElementById(str);
};
_.getByClass = function(wrap, className){
	var el = wrap.getElementsByTagName('*');
	var arr = new Array();
	for(var i = 0; i < el.length; i++){
		if(el[i].className.match(className)){ arr.push(el[i]); }
	}
	return arr;
};
_.getByName = function(name, wrap){
	if(wrap){
		var arr = [];
		var els = wrap.getElementsByTagName('*');
		for(var i = 0, l = els.length; i < l; i++){ if(els[i].name == name){ arr.push(els[i]); } }
		return arr;
	}
	else{
		return document.getElementsByName(name);
	}
};
_.node = function(){
	var element = document.createElement(arguments[0]);
	if(arguments[1]){
		if(typeof arguments[1] == 'string' || typeof arguments[1] == 'number'){
			element.appendChild(document.createTextNode(arguments[1]));
		}else if(arguments[1].constructor == Object){
			for(var key in arguments[1]){
				if(key == 'innerHTML'){
					element.innerHTML = arguments[1][key];
				}else if(key == 'class'){
					element.className = arguments[1][key];
				}else{
					element.setAttribute(key, arguments[1][key]);
				}
			}
		}else{
			for(var i = 1, l = arguments.length; i < l; i++){
				if(arguments[i].nodeType){ element.appendChild(arguments[i]); }
			}
		}
	}
	if(arguments[2]){
		if(typeof arguments[2] == 'string' || typeof arguments[2] == 'number'){
			element.appendChild(document.createTextNode(arguments[2]));
		}else{
			for(var i = 2, l = arguments.length; i < l; i++){
				if(arguments[i].nodeType){ element.appendChild(arguments[i]); }
			}
		}
	}
	return element;
};
_.remove = function(el){
	if(el && el.parentNode){el.parentNode.removeChild(el); }
};
_.clearNode = function(el){
	while(el.childNodes.length != 0){ el.removeChild(el.firstChild); }
	return el;
};
_.nextEl = function(el){
	return el.nextSibling;
};
_.insertFirst = function(el, target){
	if(target.firstChild){ _.insertBefore(el, target.firstChild); }else{ target.appendChild(el); }
	return el;
};
_.insertBefore = function(el, target){
	target.parentNode.insertBefore(el, target);
	return el;
};
_.insertAfter = function(el, target){
	var before = target.nextSibling;
	if(before != null){ _.insertBefore(el, before); }
	else{ target.parentNode.appendChild(el); }
	return el;
};
_.isChild = function(el, ch, flag){
	var els = el.getElementsByTagName('*');
	for(var i = 0, l = els.length; i < l; i++){
		if(els[i] === ch){ return true; }
	}
	return (flag)? el === ch : false;
};
_.dataset = function(el, attr){
	if(el.dataset){
		return el.dataset[attr];
	}else{
		return el.getAttribute('data-'+attr);
	}
};
_.getPageSize = function(){
	var d = document,
		de = d.documentElement,
		o = {
			'height' : Math.max(
				Math.max(d.body.scrollHeight, de.scrollHeight),
				Math.max(d.body.offsetHeight, de.offsetHeight),
				Math.max(d.body.clientHeight, de.clientHeight)
			),
			'width' : Math.max(
				Math.max(d.body.scrollWidth, de.scrollWidth),
				Math.max(d.body.offsetWidth, de.offsetWidth),
				Math.max(d.body.clientWidth, de.clientWidth)
			),
			'winHeight' : de.clientHeight,
			'winWidth' : de.clientWidth
		};
	return o;
};
_.getOffset = function(o){
	var x = 0,
		y = 0;
	while(o){
		x+=o.offsetLeft;
		y+=o.offsetTop;
		o=o.offsetParent;
	}	
	return [x, y];
};
_.addStyles = function(el, line){
	var arr = line.replace(/\s/g, '').split(';');
	for(var i = 0, l = arr.length; i < l; i++){
		if(arr[i] && arr[i].length > 0){
			var style = arr[i].split(':');
			// Add style to element
			style[2] = _.styleHash(style[0]);
			if(style[0] == 'float'){
				el.style[style[2][0]] = style[1];
				el.style[style[2][1]] = style[1];
			}else{
				el.style[style[2]] = style[1];
			}
		}
	}
	return el;
};
_.getStyle = function(el, style, number){
	switch(style){
		case 'height' : return el.offsetHeight; break;
		case 'width' : return el.offsetWidth; break;
		case 'left' : return el.offsetLeft; break;
		case 'top' : return el.offsetTop; break;
		default :
			var obj = null;
			if(typeof el.currentStyle != 'undefined'){
				var obj = el.currentStyle;
			}else{
				var obj = document.defaultView.getComputedStyle(el, null);
			}
			if(obj[style]){
				if(number){
					return parseFloat(obj[style].toString().replace(/(pt|px|%)/g,''));
				}else{
					return obj[style];
				}
			}else{
				return 0;
			}
		break;
	}
};
_.styleHash = function(line){
	var line = line.replace(/\s/g, '');
	if(line == 'float'){
		line = ['cssFloat','styleFloat'];
	}else if(line.match('-')){
		var st = line.split('-');
		line = st[0]+st[1].replace(st[1].charAt(0), st[1].charAt(0).toUpperCase());
	}
	return line;
};
_.addClass = function(el, cssClass){
	if(el && cssClass){
		var arr = (el.className.length > 0)? _.makeObject(el.className.split(/\s+/)) : {};
		var cls = cssClass.split(/\s+/);
		for(var i = 0; i < cls.length; i++){ arr[cls[i]] = cls[i]; }
		el.className = _.makeArray(arr).join(' ');
	}
	return el;
};
_.removeClass = function(el, cssClass){
	if(el && cssClass){
		var arr = (el.className.length > 0)? _.makeObject(el.className.split(/\s+/)) : {};
		var cls = cssClass.split(/\s+/);
		for(var i = 0; i < cls.length; i++){ if(arr[cls[i]]){ delete(arr[cls[i]]); } }
		el.className = _.makeArray(arr).join(' ');
	}
	return el;
};
_.setScrollTop = function(num){
	document.documentElement.scrollTop = num;
	document.body.scrollTop = num;
};
_.getDocScrollTop = function(){
	return Math.max(
		document.documentElement.scrollTop,
		document.body.scrollTop,
		0
	);
};
_.getDocScrollLeft = function(){
	return Math.max(
		document.documentElement.scrollLeft,
		document.body.scrollLeft,
		0
	);
};
_.hideSpecialTags = function(wrap){
	var wrap = wrap || document;
	if(document.querySelectorAll){
		var els = document.querySelectorAll('iframe,object,embed');
		for(var i = 0, l = els.length; i < l; i++){
			els[i].style.visibility = 'hidden';
		}
	}else{
		var els = document.getElementsByTagName('*');
		for(var i = 0, l = els.length; i < l; i++){
			if(els[i].tagName && /iframe|object|embed/.test(els[i].tagName)){
				els[i].style.visibility = 'hidden';
			}
		}
	}
	return wrap;
};
_.showSpecialTags = function(wrap){
	var wrap = wrap || document;
	if(document.querySelectorAll){
		var els = document.querySelectorAll('iframe,object,embed');
		for(var i = 0, l = els.length; i < l; i++){
			els[i].style.visibility = 'visible';
		}
	}else{
		var els = document.getElementsByTagName('*');
		for(var i = 0, l = els.length; i < l; i++){
			if(els[i].tagName && /iframe|object|embed/.test(els[i].tagName)){
				els[i].style.visibility = 'visible';
			}
		}
	}
	return wrap;
};

/* ******* STRINGS ******* */

_.decode = function(str){
	var div = document.body.appendChild(_.node('div', {'style':'white-space:pre-wrap;'}, str)),
		text;
	if(div.innerText){
		text = div.innerText;
	}else if(div.textContent){
		text = div.textContent;
	}else{
		text = str;
	}
	_.remove(div);
	return text;
};
_.reduceText = function(str, length, points){
	if(str.length > length){
		return str.slice(0, length) + ((points)? '...' : '');
	}else{
		return str;
	}
};
_.splitNumber = function(str){
	return str.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};
_.rand = function(min_n, max_n){
	return Math.floor(Math.random() * (max_n - min_n)) + min_n;
};
_.rand2 = function(min, max){
	return Math.floor(Math.random() * (max - min) + min);
};

/* ******* DATE AND TIME ******* */

_.getCurrentDate = function(){
	var date = new Date();
	return 	date.getFullYear()+
			'-'+((date.getMonth() < 9)? '0' : '')+(date.getMonth()+1)+
			'-'+((date.getDate() < 9)? '0' : '')+(date.getDate())+
			' '+((date.getHours() < 10)? '0' : '')+date.getHours()+
			':'+((date.getMinutes() < 10)? '0' : '')+date.getMinutes()+
			':'+((date.getSeconds() < 10)? '0' : '')+date.getSeconds();
};

/* ******* ANIMATION ******* */

_.transition = function(o){
	var o = _.merge({
		'el' : null,
		'style' : [],			// Массив ['height','0','px']
		'time' : 100,
		'type' : 'easy-in-out',
		'delay_in' : 0,
		'delay_out' : 1000/60,
		'onend' : function(){},
		'clear' : true
	}, o);
	// Перевести стиль в жс вид
	for(var i = 0, l = o.style.length; i < l; i++){
		var obj = o.style[i];
		obj[3] = _.styleHash(obj[0]);
	}
	// Start
	var styles = '';
	for(var i = 0, l = o.style.length; i < l; i++){
		var obj = o.style[i];
		styles += (styles.length == 0)? obj[0] : ', '+obj[0];
	}
	setTimeout(function(){
		// Presto
		o.el.style['OTransitionProperty'] = styles;
		o.el.style['OTransitionDuration'] = o.time/1000+'s';
		o.el.style['OTransitionTimingFunction'] = o.type;
		// Gecko
		o.el.style['MozTransitionProperty'] = styles;
		o.el.style['MozTransitionDuration'] = o.time/1000+'s';
		o.el.style['MozTransitionTimingFunction'] = o.type;
		// Webkit
		o.el.style['WebkitTransitionProperty'] = styles;
		o.el.style['WebkitTransitionDuration'] = o.time/1000+'s';
		o.el.style['WebkitTransitionTimingFunction'] = o.type;
		// Default
		o.el.style['transitionProperty'] = styles;
		o.el.style['transitionDuration'] = o.time/1000+'s';
		o.el.style['transitionTimingFunction'] = o.type;
		// Set styles
		for(var i = 0, l = o.style.length; i < l; i++)
		{
			var obj = o.style[i];
			o.el.style[obj[3]] = obj[1] + obj[2];
		}
	}, o.delay_in);
	// On animation end
	setTimeout(function(){
		if(o.clear){
			// Presto
			o.el.style['OTransitionProperty'] = 'none';
			o.el.style['OTransitionDuration'] = '0s';
			o.el.style['OTransitionTimingFunction'] = '';
			// Gecko
			o.el.style['MozTransitionProperty'] = 'none';
			o.el.style['MozTransitionDuration'] = '0s';
			o.el.style['MozTransitionTimingFunction'] = '';
			// Webkit
			o.el.style['WebkitTransitionProperty'] = 'none';
			o.el.style['WebkitTransitionDuration'] = '0s';
			o.el.style['WebkitTransitionTimingFunction'] = '';
			// Default
			o.el.style['transitionProperty'] = 'none';
			o.el.style['transitionDuration'] = '0s';
			o.el.style['transitionTimingFunction'] = '';
		}
		o.onend();
	}, o.delay_in+o.time+o.delay_out);
};

/* ******* COOKIE ******* */

_.cookie = {
	set:function(name, value, expires){
		document.cookie = name + "=" + escape(value) + ";expires=" + _.cookie.date(_.cfg.client.cookie_expires);
	},
	get:function(name){
		var cookie = " " + document.cookie;
		var search = " " + name + "=";
		var setStr = null;
		var offset = 0;
		var end = 0;
		if(cookie.length > 0){
			offset = cookie.indexOf(search);
			if(offset != -1){
				offset += search.length;
				end = cookie.indexOf(";", offset)
				if(end == -1){
					end = cookie.length;
				}
				setStr = unescape(cookie.substring(offset, end));
			}
		}
		return setStr;
	},
	date:function(num){
		return (new Date(new Date().getTime () + 1000 * 60 * 60 * 24 * num)).toGMTString() + ';';
	}
};

/* ******* ON DOM READY by Ryan Morr ******* */

function onDOMReady(fn,ctx){var ready,timer;var onChange=function(e){if(e&&e.type=="DOMContentLoaded")fireDOMReady();else if(e&&e.type=="load")fireDOMReady();else if(document.readyState)if(/loaded|complete/.test(document.readyState))fireDOMReady();else if(!!document.documentElement.doScroll){try{ready||document.documentElement.doScroll("left")}catch(e){return}fireDOMReady()}};var fireDOMReady=function(){if(!ready){ready=true;fn.call(ctx||window);if(document.removeEventListener)document.removeEventListener("DOMContentLoaded",
onChange,false);document.onreadystatechange=null;window.onload=null;clearInterval(timer);timer=null}};if(document.addEventListener)document.addEventListener("DOMContentLoaded",onChange,false);document.onreadystatechange=onChange;timer=setInterval(onChange,5);window.onload=onChange};