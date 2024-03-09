//magic
phina.globalize();
//screen size
let SCREEN_X = 640;
let SCREEN_Y = 480;
//start delay
let DIREY = 120;
//video img
// const player = document.getElementById('player');
// navigator.mediaDevices.getUserMedia({video: true, audio: false})
// .then(function(stream){
//   player.srcObject = stream;
//   player.play();
// });
//face detection
// Promise.all([faceapi.nets.tinyFaceDetector.load("./models"),]);
// const options = new faceapi.TinyFaceDetectorOptions({inputSize:320,scoreThreshold:0.1});
// async function detectFace(bar){
//     const result = await faceapi.detectSingleFace(player,options);
//     if(!result) return;
//     bar.x = SCREEN_X-(result._box._x + result._box._width/2);
// }
//img asset
var ASSETS = {
    image: {
      'cat': './Image/nyan.png',
      'bar' :'./Image/bar.png',
    },
  };
//Display class
phina.define("MainScene", {
    superClass: 'DisplayScene',
    init: function(option) {
        this.superInit(option);
        this.backgroundColor = 'gray';
        //video img
        // this.elem  = PlainElement({width: SCREEN_X,height: SCREEN_Y}).addChildTo(this)
        // this.elem.setPosition(SCREEN_X/2, SCREEN_Y/2);
        // this.elem.canvas.translate( 640, 0 ).scale( -1, 1 );
        //floor_bottom
        this.floor_bottom = Sprite('bar').addChildTo(this).setPosition(SCREEN_X/2, 9*(SCREEN_Y/10));
        this.floor_bottom.setSize(SCREEN_X,10);
        this.floor_bottom.bounce = 0.8;
        //floor_top
        this.floor_top = Sprite('bar').addChildTo(this).setPosition(SCREEN_X/2, 0);
        this.floor_top.setSize(SCREEN_X,10);
        this.floor_top.bounce = 0.8;
        //floor_right
        this.floor_right = Sprite('bar').addChildTo(this).setPosition(SCREEN_X, SCREEN_Y/2);
        this.floor_right.setSize(10,SCREEN_Y);
        this.floor_right.bounce = 0.8;
        //floor_left
        this.floor_left = Sprite('bar').addChildTo(this).setPosition(0, SCREEN_Y/2);
        this.floor_left.setSize(10,SCREEN_Y);
        this.floor_left.bounce = 0.8;
        //bar(player)
        this.jumper = Cat('cat',60,70,320,360).addChildTo(this);
        this.jumper.setPosition(this.jumper.x_pos,this.jumper.y_pos);
        this.jumper.setSize(this.jumper.x_size,this.jumper.y_size);
        this.jumper.physical.gravity.y = 0.5;
    },
    update: function(app){
        var jumper = this.jumper;
        const p = app.pointer;
        if(p.getPointingStart()){
            this.jumper.jump();
        }
        // this.elem.canvas.context.drawImage(player, 0, 0, SCREEN_X ,SCREEN_Y);
        // detectFace(runner);
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
    init: function(image ,x_size,y_size,x_pos,y_pos) {
        this.superInit(image);
        this.x_size = x_size;
        this.y_size = y_size;
        this.y_size_init = y_size;
        this.x_pos = x_pos;
        this.y_pos = y_pos; 
        this.time = 0;
    },
    update: function() {
        // this.time= (this.time+0.2)%3.14;
        // this.y_size = 5*Math.sin(this.time) + this.y_size_init-5;
        // this.y = -2.5*Math.sin(this.time) + this.y;
        // this.setSize(this.x_size,this.y_size);
    },
    jump:function(){
        if(this.physical.velocity.x >= 0){
            this.physical.velocity.set(0,0);
            this.physical.addForce(5,-15);
        }
        else{
            this.physical.velocity.set(0,0);
            this.physical.addForce(-5,-15);
        }
    },
});
//main function
phina.main(function() {
    var app = GameApp({startLabel: 'main', width: SCREEN_X, height: SCREEN_Y, assets: ASSETS});
    app.run();
});