var IS_IOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? !0 : !1,
IS_ANDROID = -1 < navigator.userAgent.indexOf("Android");
var USE_NATIVE_SOUND = !1;
var IS_IOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? !0 : !1;
var IS_NATIVE_ANDROID = IS_ANDROID && -1 < navigator.userAgent.indexOf("Version");
var $$Client = {};
$$Client.contextPath = '';
$$Client.gameResource = 'user';
$$Client.gameType = 'hard'; //easy,normal,hard
$$Client.isv = 0;
$$Client.mood1 = 'img/data/img-1.jpg';
$$Client.mood2 = 'img/data/img-2.jpg';
$$Client.mood3 = 'img/data/img-3.jpg';
$$Client.mood4 = 'img/data/img-4.jpg';
$$Client.mood5 = 'img/data/img-5.jpg';
$$Client.mood6 = 'img/data/img-6.jpg';
$$Client.gameTime = 20;
$$Client.actid = 19910616;
$$Client.minscore = 300;

var W = 640,
H = 1000,
IS_TOUCH, SCREEN_SHOW_ALL = !0;

var App = (function(app){

	function layout(){
		var canvas = app.stage.canvas,
        winW = window.innerWidth,
        winH = window.innerHeight;
        if (SCREEN_SHOW_ALL) {
			winW / winH > W / H ? winW = W * winH / H: winH = H * winW / W,
			canvas.style.marginTop = 0;
		}else {
            var w = W * winH / H;
            winW >= w ? (winW = w, stage.x = 0) : stage.x = (winW - w) / 2;
        }
       	canvas.width = W;
		canvas.height = H;
		canvas.style.left = '50%';
        canvas.style.marginLeft = -150+"px";
        canvas.style.width = 300 + "px";
        canvas.style.height = 468 + "px";
        $('#container').height(468);
	}
	window.onresize = layout;
	app.stage = null;
    app.queueHome = null;
	window.onload = function(){			

		
		$('#container').height(window.innerHeight);
		app.stage = new createjs.Stage("game");
                
        createjs.Ticker.setFPS(60);		
        setTimeout(layout, 100);		
		if (IS_TOUCH = createjs.Touch.isSupported()) {
            createjs.Touch.enable(app.stage, !0);
            app.stage.mouseEnabled = !1;
        }


		createjs.Ticker.on("tick", function(){			
			app.stage.update();			
		});
		
		//加载首页资源
		app.queueHome = new createjs.LoadQueue(false);
		app.queueHome.on("complete", _cfgHome.startFunc, null, !0);	
		_cfgHome.img && app.queueHome.loadManifest(_cfgHome.img);

        /*重新开始游戏*/
       	$('#btnReplay').add('#btnToReplay').on('click',function(e){			
			App.stage.removeAllChildren();
			Game.stop = false;
			clearInterval(Game.interval);
			Game.vGame = new Stage.vGame;
			App.stage.addChild(Game.vGame);
//			$('.dialog').add('.dialog-box-out').hide();
            $('.all').removeClass('homeBg').addClass('gameBg');
            $('.g-tip-wrap').hide();
		})
        /*继续游戏*/
//		$('#btnContinue').on('click',function(e){
//			Game.stop = false;
//			$('.dialog').hide();
//		})
//
//		$('#btnHome').add('#btnToHome').on('click',function(e){
//            console.log('btnToHome')
//			Game.stop = false;
//			clearInterval(Game.interval);
//			App.stage.removeAllChildren();
//			Game.vHome = new Stage.vHome;
//			App.stage.addChild(Game.vHome);
//			$('.all').removeClass('gameBg')
//			$('.banner').hide();
//		})


        /*关闭提示层*/
        $('.close-tip').on('click',function(){
            $('.g-tip-wrap').hide();
        })
		
	}
	return app;
})(App || {})

