//magic
phina.globalize();
//screen size
let SCREEN_X = 640;
let SCREEN_Y = 480;
//start delay
let DIREY = 120;
//video img
const player = document.getElementById('player');
navigator.mediaDevices.getUserMedia({video:true, audio: false})
.then(function(stream){
  player.srcObject = stream;
  player.play();
});
//face detection
Promise.all([faceapi.nets.tinyFaceDetector.load("./models"),
            faceapi.nets.faceLandmark68TinyNet.load('./models')]).then(detectFace)
const options = new faceapi.TinyFaceDetectorOptions({inputSize:256,scoreThreshold:0.5});
function detectFace(){
    const result = faceapi.detectSingleFace(player,options).withFaceLandmarks(true);
    if(!result) return;
    console.log(result);
}
//img asset
var ASSETS = {
    image: {
      'cat': './Image/nyan.png',
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
        detectFace();
        if(app.frame%30==0){
            this.spawn_apple(Math.randint(0, SCREEN_X),-50);
        }
    },
    spawn_apple(x,y) {
        Apple('apple',x,y).addChildTo(this.appleGroup);
      },
});
//Cat class
phina.define('Cat', {
    superClass: 'Sprite',
    init: function(image) {
        this.superInit(image);
    },
    update: function() {

    },
});
//apple class
phina.define('Apple', {
    superClass: 'Sprite',
    init: function(image,x,y) {
        this.superInit(image);
        this.setSize(50,50);
        this.setPosition(x,y);
    },
    update: function() {
        this.y +=1;
        if(this.y > SCREEN_Y-15){
            this.remove();
        }
    },
});
//main function
phina.main(function() {
    var app = GameApp({startLabel: 'main', width: SCREEN_X, height: SCREEN_Y, assets: ASSETS});
    app.run();
});