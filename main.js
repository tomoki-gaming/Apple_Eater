//magic
phina.globalize();
//screen size
let SCREEN_X = 640;
let SCREEN_Y = 480;
//video img
const player = document.getElementById('player');
navigator.mediaDevices.getUserMedia({video:true, audio: false})
.then(function(stream){
  player.srcObject = stream;
  player.play();
});
//clmtrackr
var tracker = new clm.tracker();
tracker.init(pModel);
tracker.start(player);
//FaceDetector
function detectFace(canvas){
    var positions = tracker.getCurrentPosition();

    if(positions.length != undefined){
        return drawMouseLine(canvas,positions);
    }
    return 0;
}
function drawMouseLine(canvas,positions){
    canvas.drawLine(positions[44][0]*2,positions[44][1]*2, positions[47][0]*2,positions[47][1]*2);
    canvas.drawLine(positions[47][0]*2,positions[47][1]*2, positions[50][0]*2,positions[50][1]*2);
    canvas.drawLine(positions[44][0]*2,positions[44][1]*2, positions[53][0]*2,positions[53][1]*2);
    canvas.drawLine(positions[53][0]*2,positions[53][1]*2, positions[50][0]*2,positions[50][1]*2);
    var pos = [positions[44][0]*2,positions[50][0]*2,positions[47][1]*2,positions[53][1]*2]
    return pos;
}
//img asset
var ASSETS = {
    image: {
      'apple':'./Image/apple.png',
      'bomb':'./Image/bomb.png'
    },
  };
//Display class
phina.define("MainScene", {
    superClass: 'DisplayScene',
    init: function(option) {
        this.superInit(option);
        this.backgroundColor = 'gray';
        //video img
        this.elem  = PlainElement({width: SCREEN_X, height: SCREEN_Y}).addChildTo(this);
        this.elem.setPosition(SCREEN_X/2, SCREEN_Y/2);
        this.elem.canvas.translate( 640, 0 ).scale( -1, 1 );
        //cat
        // this.cat = Cat('cat').addChildTo(this).setSize(420,300).setPosition(SCREEN_X/2,SCREEN_Y/2);
        //apple
        this.appleGroup = DisplayElement().addChildTo(this);
    },
    update: function(app){
        // this.cat.x = app.pointer.x;
        this.elem.canvas.context.drawImage(player, 0, 0, SCREEN_X ,SCREEN_Y);
        var pos = detectFace(this.elem.canvas);
        this.delete_apple(pos);
        if(app.frame%30==0){
            this.spawn_apple(Math.randint(SCREEN_X/4, (SCREEN_X*3)/4),-50);
        }
    },
    spawn_apple(x,y) {
        Apple('apple',x,y).addChildTo(this.appleGroup);
    },
    delete_apple(pos){
        this.appleGroup.children.each(function(apple){
            apple.delete_in_mouse(pos);
        });
    },
});
//apple class
phina.define('Apple', {
    superClass: 'Sprite',
    init: function(image,x,y) {
        this.superInit(image);
        this.size = [50,50];
        this.pad = 5;
        this.setSize(this.size[0],this.size[1]);
        this.setPosition(x,y);
    },
    update: function() {
        this.y +=1;
        if(this.y > SCREEN_Y-15){
            this.remove();
        }
    },
    delete_in_mouse:function(pos){
        if(SCREEN_X-this.x>=pos[0]+this.pad && SCREEN_X-this.x<=pos[1]-this.pad){
            if(this.y>=pos[2]+this.pad && this.y<=pos[3]-this.pad){
                this.remove();
            }
        }
    }
});
//main function
phina.main(function() {
    var app = GameApp({startLabel: 'main', width: SCREEN_X, height: SCREEN_Y, assets: ASSETS});
    app.run();
});