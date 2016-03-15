var bonus = new Howl({
  urls: [
          'audio/bonus.mp3',
          'audio/bonus.ogg',
          'audio/bonus.wav']
});

var humm = new Howl({
  urls: [
          'audio/Humm.mp3',
          'audio/Humm.ogg',
          'audio/Humm.wav'
  ]
});
var Game = (function(Game){
	//游戏分数
	Game.score = 0;
	//游戏时间
	Game.time = $$Client.gameTime;
	//是否已经完成游戏主要素材加载
	Game.hasLoadResource = false;
	//用户是否点击了开始游戏按钮
	Game.hasClickStart = false;
	//关卡
	Game.level = 1;
	//游戏难易度
	Game.type = $$Client.gameType;
	//出现列数
	Game.col = 0;
	//出现行数
	Game.row = 0;
	//表情数组
	Game.moodsArr = [];
	//冻结
	Game.wait = false;
	//游戏定时器
	Game.interval = null;
	//游戏是否暂停
	Game.stop = false;
	//点错音效
	//Game.wrong =  $$Client.contextPath+"/audio/eye/Humm.mp3";
	//点对音效
	//Game.right = $$Client.contextPath+"/audio/eye/bonus.mp3";
	
	Game.getHomeResult = function(a) {
        return App.queueHome.getResult(a);
    };
	Game.getResult = function(a) {
        return App.queueGame.getResult(a);
    };
	//游戏结束
	Game.gameover = function(){
        console.log('Your score:'+Game.score);
		$('.g-tip-wrap').show();
		$('.score-num').text(Game.score);
        //TODO 后台处理数据

	};
	return Game;
})(Game || {});

var Stage = (function(obj){
	
	//游戏首页
	obj.vHome = function(){
		this.initialize();
		this.x = 0;
        this.y =60;
		
		//开始游戏按钮
		var btnStart = new BtnStart(0,530,110);
		

		//开发商
		this.addChild(btnStart);
	};
	//游戏主体
	obj.vGame = function(){
		this.initialize();		
		this.x = this.y = 0;
		Game.time = parseInt($$Client.gameTime);
		Game.score = 0;
		Game.level = 1;
		Game.vHome.removeAllChildren();
		$('.banner').show();
		//游戏主体内容容器背景
		var containerBg = new createjs.Bitmap(Game.getResult('containerBg'));
		containerBg.x = (W - containerBg.getBounds().width)/2;
		containerBg.y = 120;
		var footer = new createjs.Bitmap(Game.getResult('footer'));
		footer.x = (W-footer.getBounds().width)/2;
		footer.y = 915;
		footer.alpha = 1;
		
		
		Game.vCountDown = new obj.vCountDown;
		Game.vMood = new obj.vMood;
		Game.vBar = new obj.vBar;

		this.addChild(containerBg,Game.vBar,Game.vMood);
		//显示引导页
		//localStorage.removeItem('firstPlay');
		
		//if(!localStorage.getItem('firstPlay') == true){
		//	var winH = $(window).height(),
		//		winW =$(window).width();
		//	$('.step').show();
		//	if(winW/winH > 640/1000){
		//		$('.step img').height(winH);
		//	}else{
		//		$('.step img').width(winW);
		//	}
		//	localStorage.setItem('firstPlay',true);
        //
		//}else{
			this.addChild(Game.vCountDown,footer);
			Game.vCountDown.ready();
		//}
		//var _this = this;
		//$('.step').on('click',function(){
		//	$(this).hide();
		//	_this.addChild(Game.vCountDown,footer);
		//	Game.vCountDown.ready();
		//})
		this.play = function(){
			Game.score = 0;
			Game.time = $$Client.time;			
		}
	};
	//游戏区域
	obj.vMood = function(){
		this.initialize();
		this.x = 35;
		this.y = 318;
		var _this = this;
		//显示当前关卡物体
		this.show = function(){
			Game.moodsArr = [];
			makeArray();			
			for(var i=0;i<Game.row*Game.col;i++){
				var roundRect = new createjs.Shape();
				roundRect.graphics.beginBitmapFill(Game.getResult(Game.moodsArr[i].name)).drawRoundRect(0, 0, 186, 186, 15);
				var hitArea = new createjs.Shape;	
				hitArea.graphics.beginFill("#000").drawRect(roundRect.x,roundRect.y,186,186);
				roundRect.hitArea  = hitArea;
				var size = 192;
				roundRect.max = Game.moodsArr[i].max;				
				if(Game.level > 10 && Game.level <= 18){
					
					if(Game.type == 'normal' || Game.type == 'hard'){
						roundRect.scaleX = roundRect.scaleY = 0.74;
						size = 143;						
					}				
				}
				if(Game.level > 18){
					
					if(Game.type == 'normal'){
						roundRect.scaleX = roundRect.scaleY = 0.74;
						size = 143;					
					}
					if(Game.type == 'hard'){
						roundRect.scaleX = roundRect.scaleY = 0.59;
						size = 115.5;
						//roundRect.scaleX = roundRect.scaleY = 0.49;
						//size = 96;
					}
				}										
				roundRect.x = (i % Game.col)*size;
				roundRect.y = parseInt(i / Game.row)*size;
				roundRect.onClick(function(e){
					if(Game.wait)return;
					if(Game.time<=0)return;
					var objRound = e.currentTarget;
					
					if(e.currentTarget.max == true){
						Game.level++;
						Game.time+=0.8;
						Game.score += 100;											
						Game.vBar.update();
						Game.vBar.updataTimebar();						
						_this.removeAllChildren();
						_this.show();
						bonus.currentTime = 0;
						bonus.play();						
					}else{
						_this.disable();
						humm.currentTime = 0;
						humm.play();
						//Ali.vibration.vibrate(200, function(){});					
					}
				})
				_this.addChild(roundRect);		
			}
						
		};
		var iceBg = new createjs.Bitmap(Game.getResult('ice'));
		iceBg.x = -10;
		iceBg.y = -3;
		iceBg.alpha = 0;
		//冰冻
		this.disable = function(){
			Game.wait = true;
			_this.addChild(iceBg);
			createjs.Tween.get(iceBg).to({alpha:1},200,createjs.Ease.circOut ).wait(800).to({alpha:0},200,createjs.Ease.circOut );
			setTimeout(function(){
				_this.removeChild(iceBg);
				Game.wait = false;
			},1200)
		};
		function makeArray(){
			var groupArr = [{"arr":[4,3,2]}];
			Game.col = Game.row = 3;
			if(Game.level > 5 && Game.level <= 10){
				groupArr = [{"arr":[4,3,2]}];			
				Game.col = Game.row = 3;
			}
			if(Game.level > 10 && Game.level <= 18){

				if(Game.type == "easy"){
					groupArr = [{"arr":[4,3,2]}];		
					Game.col = Game.row = 3;
				}
				if(Game.type == 'normal' || Game.type == 'hard'){
					groupArr = [{"arr":[6,5,5]}]; 		
					Game.col = Game.row = 4;
				}				
			}
			if(Game.level > 18){
				if(Game.type == 'easy'){
					groupArr = [{"arr":[4,3,2]}];
					Game.col = Game.row = 3;
				}
				if(Game.type == 'normal'){
					groupArr = [{"arr":[6,5,5]}];
					Game.col = Game.row = 4;
				}
				if(Game.type == 'hard'){
					groupArr = [{"arr":[9,8,8]}];
					Game.col = Game.row = 5;
				}
			}
					
			//var r = Math.randomInt(3);			
			//组合数组
			var arr = groupArr[0].arr;
			//表情数组						
			var moodArr = breakArr(['mood1','mood2','mood3','mood4','mood5','mood6']);
			
			for(var j=0 ; j<arr.length ; j++){				
				for(var k =0 ;k<arr[j] ;k++){
					var o = j==0 ? {"name":moodArr[j],"max":true} :{"name":moodArr[j],"max":false}					
					Game.moodsArr.push(o);
				}				
			}
			Game.moodsArr = breakArr(breakArr(breakArr(breakArr(breakArr(Game.moodsArr)))));			
			
		}
		function breakArr(arr){
			for(var i =0;i<arr.length;i++){
				var temp=arr[i];
				var rand=parseInt(Math.random()*4);
				arr[i]=arr[rand];
				arr[rand]=temp;
			}
			return arr;
		}
	}
	//倒数
	obj.vCountDown = function () {
		this.initialize();
		this.x = this.y = 0;	
		//FDC028
		var txt = new createjs.Bitmap(Game.getResult('ready'));		
		txt.regX = 290;
		txt.regY = 80;
		txt.x = 320;
		txt.y = 520;	
			
		this.ready = function (b) {		
			this.addChild(txt);
			txt.scaleX = txt.scaleY = 3;
			txt.regX = txt.getBounds().width / 2;
			txt.regY = txt.getBounds().height / 2;
			txt.alpha = 0 ;
			createjs.Tween.get(txt).wait(200).to({alpha:1, scaleX:1, scaleY:1}, 300,createjs.Ease.circOut).to({}, 900).call(function () {
				txt.image = Game.getResult('go');
				txt.regX = txt.getBounds().width / 2;
				txt.regY = txt.getBounds().height / 2;
				
				createjs.Tween.get(txt).to({scaleX:1}, 300).to({alpha:0}, 200).call(function () {
					txt.parent.removeChild(txt);
					Game.vBar.start();
					Game.vMood.show();
				});
			});
		};
	};
	//分数、时间
	obj.vBar = function(){
		this.initialize();
		this.x = this.y = 0;
		
		var score = new createjs.Text(Game.score,'50px Arial',"#fff");
		score.x = 370;

		score.textAlign = "center";
		var time = new createjs.Text(Game.time,'54px Arial',"#FFF");
		time.x = 152;
		time.y = score.y = 126;
        score.y=150;
		time.textAlign = score.textAlign = "center";
		var timeBar = new createjs.Bitmap(Game.getResult('timeBar'));
		timeBar.x = -150;
		timeBar.y = 257;
		var mask = new createjs.Shape();
        mask.graphics.beginFill('#000').drawRoundRect(75, 255, 594, 24, 15);
		timeBar.mask = mask;
		this.addChild(score,timeBar);
		Game.time = $$Client.gameTime;
		var pos = 285 / $$Client.gameTime;
		var _this = this;
		this.start = function(){
			createjs.Tween.get(timeBar,{override:true}).to({x:-440},$$Client.gameTime*1000);
			timeBar.move = function(){					
				pos = (525-90+timeBar.x)/Game.time;
				if(Game.stop)return;
				if(Game.time <= 0){
					clearInterval(Game.interval);				
					Game.gameover();	
					return ;
				}
				Game.time>0 && Game.time--;
				time.text = Game.time;
			};
			_this.interval();
		};
		this.interval = function(){
			Game.interval = setInterval(timeBar.move,1000);	
		};
		this.update = function(){
			score.text = Game.score;	
			time.text = Game.time;			
		};
		this.updataTimebar = function(){	
			pos = (525-90+timeBar.x)/Game.time;
			createjs.Tween.get(timeBar,{override:true}).to({x:timeBar.x+pos*0.8},20).to({x:-440},Game.time*1000);
		}
	};
	obj.vGame.prototype  	   =   new createjs.Container;
	obj.vCountDown.prototype   =   new createjs.Container;
	obj.vHome.prototype  	   =   new createjs.Container;
	obj.vMood.prototype  	   =   new createjs.Container;
	obj.vBar.prototype  	   =   new createjs.Container;
	createjs.DisplayObject.prototype.onClick = function(a){
        this.on("click",function(event) {
            createjs.Touch.isSupported() && event.nativeEvent.constructor == MouseEvent || a(event);
        })
    };
	return obj;
})(Stage || {});

function setup(){		
	$('.Tida-enter-header').hide();
//    console.log('start')
	$('.all').removeClass('homeBg').addClass('gameBg');
	Game.vGame = new Stage.vGame;
	App.stage.addChild(Game.vGame);	
	
	
}
function init(){	
	document.ge
	Game.vHome = new Stage.vHome;
	App.stage.addChild(Game.vHome);
	var progressTxt = new createjs.Text('0%','40px Arial','#FFF');
	progressTxt.x = W/2;
	progressTxt.y = 570-50;
	progressTxt.textAlign = "center";	
	progressTxt.name = "progress";
	progressTxt.alpha = 0;
	Game.vHome.addChild(progressTxt);
	//加载游戏主要资源
	App.queueGame = new createjs.LoadQueue(false);
	App.queueGame.on("complete", startGame , null, !0);	
	App.queueGame.on("progress", loadingProgress, null);
	_cfgGame.img && App.queueGame.loadManifest(_cfgGame.img);
	App.queueGame.load();
	//App.queueGame.installPlugin(createjs.Sound);
	
	//createjs.Sound.alternateExtensions = ["mp3"];
	//createjs.Sound.addEventListener("fileload", playSound);
	//createjs.Sound.registerSound(Game.right, true);
	//createjs.Sound.registerSound(Game.wrong, true);
}
//游戏资源加载完成回调
function startGame(){
	Game.hasLoadResource = true;
	//USE_NATIVE_SOUND || (IS_NATIVE_ANDROID ? (createjs.Sound.registMySound("flip", 0), createjs.Sound.registMySound("bonus", 2), createjs.Sound.registMySound("silenttail", 4)) : (createjs.Sound.alternateExtensions = ["ogg"], App.queueGame.installPlugin(createjs.Sound)));				
	if(Game.hasClickStart == true){
		_cfgGame.startFunc();
	}
}
//加载进度回调
function loadingProgress(a){
	Game.vHome.getChildByName('progress').text = parseInt(100 * a.progress) + "%";	
	if(Game.hasClickStart == true){			
		Game.vHome.getChildByName('progress').alpha =1;		
	}	
}
(function() {
    Array.prototype.indexOf = function(a) {
        for (var b = 0; b < this.length; b++) {
			if (this[b] == a) return b;
		}
        return - 1
    };
    Array.prototype.remove = function(a) {
        a = this.indexOf(a); 	
		a > -1 && this.splice(a, 1)
    };
    Math.randomInt = function(a) {
        return parseInt(Math.random() * a);
    }
})();

var _cfgHome = {
    startFunc: init,
    img: {
        manifest: [
			//{
			//	src : 'img/prizeIcon.png',
			//	id : 'prizeIcon'
			//},
			{
				src : 'img/startIcon.png',
				id : 'startIcon'
			},
			{
				src : 'img/loading.png',
				id : 'loading'
			},
			{
				src : 'img/loadingTxt.png',
				id : 'loadingTxt'
			}
		]
    }
};
var _cfgGame = {
    startFunc: setup,
    img: {
         manifest: [{
			src : 'img/gameBg.jpg',
			id : 'gameBg'
		},{
			src : 'img/containerBg.png',
			id : 'containerBg'
		},{
			src : 'img/ice.png',
			id : 'ice'
		},{
			src : 'img/timeBar.png',
			id : 'timeBar'
		},{
			src : 'img/ready.png',
			id : 'ready'
		},{
			src : 'img/go.png',
			id : 'go'
		},{
			src : 'img/footer.png',
			id : 'footer'
		},{
			src : $$Client.mood1,
			id : 'mood1'
		},{
			src : $$Client.mood2,
			id : 'mood2'
		},{
			src : $$Client.mood3,
			id : 'mood3'
		},{
			src : $$Client.mood4,
			id : 'mood4'
		},{
             src : $$Client.mood5,
             id : 'mood5'
         },{
             src : $$Client.mood6,
             id : 'mood6'
         }]
    }
};

function BtnStart(x,y,r){
	this.initialize();
	this.x = this.y = 0;
	var line1 = new createjs.Shape();
	line1.graphics.beginStroke('#FFF').drawCircle(x, y, r+35).endStroke();
	line1.alpha = 0;
	var line2 = new createjs.Shape();
	line2.graphics.beginStroke('#FFF').drawCircle(x, y, r+25).endStroke();
	line2.alpha = 0.5;
	var line3 = new createjs.Shape();
	line3.graphics.beginStroke('#FFF').drawCircle(x, y, r+15).endStroke();
	line3.alpha = 1;
	line1.regX = line2.regX = line3.regX = -W/2;
	createjs.Tween.get(line1,{loop:true}).to({alpha:0.5},200).to({alpha:1},200).to({alpha:0.5},200).to({alpha:0},200).wait(100);
	createjs.Tween.get(line2,{loop:true}).to({alpha:1},200).to({alpha:0.5},200).to({alpha:0},200).to({alpha:0.5},200).wait(100);
	createjs.Tween.get(line3,{loop:true}).to({alpha:0.5},200).to({alpha:0},200).to({alpha:0.5},200).to({alpha:1},200).wait(100);
	var circle = new createjs.Shape();
	circle.graphics.setStrokeStyle(10, 'round', 'round').beginStroke("#FFF").beginFill("#f52750").drawCircle(x, y, r).endFill();		
	circle.regX = -W/2;
	
	var startIcon = new createjs.Bitmap(Game.getHomeResult('startIcon'));
	startIcon.x = (W-startIcon.getBounds().width)/2;
	startIcon.y = y-40;
	var txt1 = new createjs.Text();
	this.hasLoading = false;
	this.hitArea = new createjs.Shape;	
	this.hitArea.graphics.beginFill("#000").drawRect((W-260)/2,y-115,260,260);					
	var _this = this;
	this.addChild(line1,line2,line3,circle,startIcon);

    _this.onClick(function(obj){
        start();
        function start(){
            if(Game.hasLoadResource){
                //已经加载好资源，开始游戏
                _this.removeAllChildren();
                _cfgGame.startFunc();
            }else{
                Game.hasClickStart = true;
                if(_this.hasLoading)return;
                _this.hasLoading = true;

                createjs.Tween.get(_this).to({alpha:0.2},200).call(function(){
                    _this.removeAllChildren();
                    _this.alpha = 1;
                    var loading = new createjs.Bitmap(Game.getHomeResult('loading'));
                    loading.x = W/2;
                    loading.y = y;
                    loading.regX = loading.regY = 125;
                    loading.alpha = 0;
                    createjs.Tween.get(loading, {loop:true}).to({rotation: 360}, 1000);

                    var  loadingTxt = new createjs.Bitmap(Game.getHomeResult('loadingTxt'));
                    loadingTxt.x = (W-loadingTxt.getBounds().width)/2;
                    loadingTxt.y = y-100;
                    loadingTxt.alpha = 0;
                    _this.addChild(loading,loadingTxt);
                    createjs.Tween.get(loading).to({alpha: 1}, 200);
                    createjs.Tween.get(loadingTxt).to({alpha: 1}, 200);

                })
            }
        }
    })


		
	
		
}

BtnStart.prototype = new createjs.Container;



