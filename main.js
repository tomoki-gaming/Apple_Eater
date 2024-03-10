//magic
phina.globalize();
//screen size
let SCREEN_X = 640;
let SCREEN_Y = 480;
//start delay
let DIREY = 120;
//video img
const player = document.getElementById('player');
navigator.mediaDevices.getUserMedia({video: true, audio: false})
.then(function(stream){
  player.srcObject = stream;
  player.play();
});
//face detection
Promise.all([faceapi.nets.tinyFaceDetector.load("./models"),]);
const options = new faceapi.TinyFaceDetectorOptions({inputSize:320,scoreThreshold:0.1});
async function detectFace(target){
    const result = await faceapi.detectSingleFace(player,options);
    if(!result) return;
    // bar.x = SCREEN_X-(result._box._x + result._box._width/2);
    if(result._box._y + result._box._height/2 > SCREEN_Y/2){
        if(target.jump_flag==0){
            target.jump();
            target.jump_flag = 1;
        }
    }
    else target.jump_flag = 0;
}
//img asset
var ASSETS = {
    image: {
      'cat': './Image/nyan.png',
      'bar' :'./Image/bar.png',
      'apple':'./Image/apple.png',
    },
  };
//Display class
phina.define("MainScene", {
    superClass: 'DisplayScene',
    init: function(option) {
        this.superInit(option);
        this.backgroundColor = 'gray';
        //video img
        this.elem  = PlainElement({width: SCREEN_X,height: SCREEN_Y}).addChildTo(this)
        this.elem.setPosition(SCREEN_X/2, SCREEN_Y/2);
        this.elem.canvas.translate( 640, 0 ).scale( -1, 1 );
        //floor_bottom
        this.floor_bottom = Sprite('bar').addChildTo(this).setPosition(SCREEN_X/2, 9*(SCREEN_Y/10));
        this.floor_bottom.setSize(SCREEN_X/8,10);
        this.floor_bottom.bounce = 0.8;
        //floor_top
        this.floor_top = Sprite('bar').addChildTo(this).setPosition(SCREEN_X/2, -SCREEN_Y/2);
        this.floor_top.setSize(SCREEN_X,10);
        this.floor_top.bounce = 0.8;
        //floor_right
        this.floor_right = Sprite('bar').addChildTo(this).setPosition(SCREEN_X, SCREEN_Y/2);
        this.floor_right.setSize(10,SCREEN_Y*2);
        this.floor_right.bounce = 0.8;
        //floor_left
        this.floor_left = Sprite('bar').addChildTo(this).setPosition(0, SCREEN_Y/2);
        this.floor_left.setSize(10,SCREEN_Y*2);
        this.floor_left.bounce = 0.8;
        //bar(player)
        this.jumper = Cat('cat',60,70).addChildTo(this);
        this.jumper.setPosition(320,360);
        this.jumper.setSize(this.jumper.x_size,this.jumper.y_size);
        this.jumper.physical.gravity.y = 0.2;
        //(apple)
        this.apple = Sprite('apple').addChildTo(this).setPosition(SCREEN_X/4, SCREEN_Y/4);
        this.apple.setSize(50,50);
    },
    update: function(app){
        var jumper = this.jumper;
        const p = app.pointer;
        if(p.getPointingStart()){
            this.jumper.jump();
        }
        this.elem.canvas.context.drawImage(player, 0, 0, SCREEN_X ,SCREEN_Y);
        detectFace(jumper);
        this.floor_collision();
    },
    floor_collision:function(){
        //bottom
        if(this.jumper.hitTestElement(this.floor_bottom)){
            this.jumper.physical.velocity.y *= -1*this.floor_bottom.bounce;
            this.jumper.y-=2;
        }
        //top
        if(this.jumper.hitTestElement(this.floor_top)){
            this.jumper.physical.velocity.y *= -1*this.floor_top.bounce;
            this.jumper.y+=2;
        }
        //right
        if(this.jumper.hitTestElement(this.floor_right)){
            this.jumper.physical.velocity.x *= -1*this.floor_right.bounce;
            this.jumper.x-=2;
        }
        //left
        if(this.jumper.hitTestElement(this.floor_left)){
            this.jumper.physical.velocity.x *= -1*this.floor_left.bounce;
            this.jumper.x+=2;
        }
    }
});
//bar(player) class
phina.define('Cat', {
    superClass: 'Sprite',
    init: function(image ,x_size,y_size) {
        this.superInit(image);
        this.x_size = x_size;
        this.y_size = y_size;
        this.jump_flag = 0;
    },
    update: function() {

    },
    jump:function(){
        if(this.physical.velocity.x >= 0){
            this.physical.velocity.set(0,0);
            this.physical.addForce(5,-10);
        }
        else{
            this.physical.velocity.set(0,0);
            this.physical.addForce(-5, -10);
        }
    },
});
//main function
phina.main(function() {
    var app = GameApp({startLabel: 'main', width: SCREEN_X, height: SCREEN_Y, assets: ASSETS});
    app.run();
});