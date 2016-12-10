function eventEngine(){
	var handlers = {};
	var evts = [];
	var that = {};


	that.addEvent = function(eventName) {
		evts.push(eventName);
	}

	that.attachHandler = function(eventName,eventFunction){
		handlers[eventName] = handlers[eventName] || [];
		handlers[eventName].push(eventFunction);
	}

	that.detachHandlers = function(eventName){
		handlers[eventName] = [];
	}

	that.executeEvent = function(){
		for(var i=0;i<evts.length;i++){
			handlersList = handlers[evts[i]] || [];
			for(var j = 0; j < handlersList.length; j++){
				item = handlersList[j];
				item();
			}
		}
		evts = [];
	}

	return that;
}

var planeObject = {x:1,y:1,speed:20};
var eventEngine = eventEngine();
var planeWidth = 62;
var planeHeight = 73;
var bulletWidth = 20, bulletHeight = 20;

function bullets(){
	var that = {};

	that.bulletList = [];

	that.addBullet = function(aBullet){
		that.bulletList.push(aBullet);
	}

	that.render = function(){
		for(var i = that.bulletList.length -1; i >=0 ; i-- ){
			if(!that.bulletList[i].alive){
				that.bulletList.splice(i,1);
			}
			else if(undefined != that.bulletList[i] && that.bulletList[i].vanilla == true){
				that.bulletList[i].propagate();
			}
		}
	}

	return that;
}

var bullets = bullets();

function clearscreen(context,width,height){
	context.clearRect(0,0,width,height);
}

function sprite(options) {
	var that = {};

	that.context = options.context;
	that.width = options.width;
	that.height = options.height;
	that.image = options.image;
	that.cwidth = options.cwidth;
	that.cheight = options.cheight;

	that.render = function(planeObject){
		that.context.drawImage(
		that.image,
		0,0,that.width,that.height,
		planeObject.x,planeObject.y,that.width,that.height);
	};

	return that;
}

function bullet(options){
	var that = {};
	that.x = options.x;
	that.y = options.y;
	that.id = undefined;
	that.context = options.context;
	that.image = new Image();
	that.image.src = "bullet2.jpg";
	that.alive = true;
	that.vanilla = true;
	that.counter = 0;

	that.propagate = function() {
		that.vanilla = false;
		that.counter ++;

		if(that.counter%100 == 0){
			that.x+=75;
			that.counter = 0;
		}

		that.render();

		if(that.x != canvasWidth) {
			setTimeout(that.propagate(),1000);
		}
		else{
			console.log("bullet died");
			that.alive = false;
		}
	}

	that.render = function(){
		that.context.drawImage(that.image,that.x,that.y);
	}

	return that;
}

var canvas = document.getElementById("screenx");
var canvasWidth = canvas.width, canvasHeight = canvas.height;


var planeImg = new Image();

var plane = sprite({context: canvas.getContext("2d"),
				width:planeWidth,
				height:planeHeight,
				image: planeImg,
				cheight:canvas.height,
				cwidth:canvas.width});

function gameLoop(){
	window.requestAnimationFrame(gameLoop);
	clearscreen(canvas.getContext("2d"), canvas.width, canvas.height);
	plane.render(planeObject);
	bullets.render();
}

planeImg.addEventListener("load", gameLoop);
planeImg.src = "apr.png";

eventEngine.attachHandler("moveplaneu",() => {
	planeObject.y-=planeObject.speed;
})

eventEngine.attachHandler("moveplaned",() => {
	planeObject.y+=planeObject.speed;
})

eventEngine.attachHandler("moveplanel",() => {
	planeObject.x-=planeObject.speed;
})

eventEngine.attachHandler("moveplaner",() => {
	planeObject.x+=planeObject.speed;
})

eventEngine.attachHandler("firebullet",() => {
	var aBullet = bullet({context: canvas.getContext("2d"),
		x:planeObject.x + planeWidth,y:planeObject.y + planeHeight/2 - bulletHeight/2});
	bullets.addBullet(aBullet);
})

function hijackKeyboard(e){
	e = e || window.event;
	if(e.keyCode == '38'){
		eventEngine.addEvent("moveplaneu");
	}
	else if(e.keyCode == '40'){
		eventEngine.addEvent("moveplaned");
	}
	else if(e.keyCode == '37'){
		eventEngine.addEvent("moveplanel");
	}
	else if(e.keyCode == '39'){
		eventEngine.addEvent("moveplaner");
	}
	else if(e.keyCode == '32'){
		eventEngine.addEvent("firebullet");
	}
}
document.onkeydown = hijackKeyboard;

function eventLoop(){
	window.requestAnimationFrame(eventLoop);
	eventEngine.executeEvent();
}

eventLoop();