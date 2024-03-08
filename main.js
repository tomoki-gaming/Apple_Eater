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
        //floor
        this.floor = RectangleShape({width:SCREEN_X,height:10,fill:'white'}).addChildTo(this);
        this.floor.setPosition(SCREEN_X/2, 9*(SCREEN_Y/10));
        this.floor.bounce = 0.6;
        //bar(player)
        this.jumper = Cat('cat',60,70,320,380).addChildTo(this);
        this.jumper.setPosition(this.jumper.x_pos,this.jumper.y_pos)
        this.jumper.setSize(this.jumper.x_size,this.jumper.y_size);
        this.jumper.physical.gravity.y = 0.5;
    },
    update: function(app){
        var jumper = this.jumper;
        const p = app.pointer;
        if(p.getPointing()){
            this.jumper.step();
        }
        // this.elem.canvas.context.drawImage(player, 0, 0, SCREEN_X ,SCREEN_Y);
        // detectFace(runner);
        this.floor_collision();
    },
    floor_collision:function(){
        if(this.jumper.hitTestElement(this.floor)){
            this.jumper.physical.velocity.y *= -1*this.floor.bounce;
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
        this.time= (this.time+0.2)%3.14;
        this.y_size = 5*Math.sin(this.time) + this.y_size_init-5;
        this.y = -2.5*Math.sin(this.time) + this.y;
        this.setSize(this.x_size,this.y_size);
    },
    step:function(){
        this.physical.velocity.y = 0;
        this.physical.addForce(0,-15);
    }
});
//main function
phina.main(function() {
    var app = GameApp({startLabel: 'main', width: SCREEN_X, height: SCREEN_Y, assets: ASSETS});
    app.run();
});