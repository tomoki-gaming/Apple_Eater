//ビデオキャプチャ
const player = document.getElementById('player');
navigator.mediaDevices.getUserMedia({video:true, audio: false})
.then(function(stream){
  player.srcObject = stream;
  player.play();
});
//clmtrackr(顔ランドマーク認識)
var tracker = new clm.tracker();
tracker.init(pModel);
tracker.start(player);
//顔認識
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
//メインシーン
phina.define("MainScene", {
    superClass: 'DisplayScene',
    init: function(option) {
        this.superInit(option);
        this.backgroundColor = 'gray';
        //ビデオ
        this.elem  = PlainElement({width: SCREEN_X, height: SCREEN_Y}).addChildTo(this);
        this.elem.setPosition(SCREEN_X/2, SCREEN_Y/2);
        this.elem.canvas.translate( 640, 0 ).scale( -1, 1 );
        //リンゴ画像
        this.appleGroup = DisplayElement().addChildTo(this);
        //スコアのテキスト
        this.score = 0;
        this.label = Label({text:'SCORE:'+this.score, fill:"white" ,align:'left'}).addChildTo(this);
        this.label.setPosition(SCREEN_X/50, SCREEN_Y/15);
        //失敗判定テキスト
        this.label_f = Label({text:'', fill:"red"}).addChildTo(this);
        this.label_f.setPosition(SCREEN_X/2, SCREEN_Y/2);
        //シーン遷移のフラグとカウント
        this.flag = 0;
        this.scene_count = 0;
    },
    update: function(app){
        var score ,flag;
        this.elem.canvas.context.drawImage(player, 0, 0, SCREEN_X ,SCREEN_Y);
        var pos = detectFace(this.elem.canvas);
        score , flag = this.delete_apple(pos);
        this.scene_trans(app,flag);
        if(app.frame%30==0 && this.scene_count == 0){
            this.spawn_apple(Math.randint(SCREEN_X/4, (SCREEN_X*3)/4),-50);
        }
        if(score){
            this.score += score;
            this.label.text = 'SCORE:'+this.score;
        }
    },
    spawn_apple:function(x,y) {
        if (Math.randint(0, 20) < 20) Apple('apple',x,y,'apple').addChildTo(this.appleGroup);
        else Apple('bomb',x,y,'bomb').addChildTo(this.appleGroup);
    },
    delete_apple:function(pos){
        var scores = 0;
        var game_flag = 0;
        this.appleGroup.children.each(function(apple){
            add_score = apple.delete_in_mouse(pos);
            if(add_score>=0){
                scores += add_score
                game_flag += apple.delete_under_frame();
            }
            else{
                game_flag = 1;
            }
        });
        return scores ,game_flag;
    },
    scene_trans:function(app,flag){
        if(flag > 0) this.flag =1;
        if(this.flag > 0){
            if(this.scene_count > DIREY){
                this.exit({nextLabel: 'main'});
            }
            else if(this.scene_count==0){
                this.label_f.text = 'FAILURE';
                this.appleGroup.remove();
            }
            this.scene_count += app.deltaTime;
        }
    }
});
//メイン関数
phina.main(function() {
    var app = GameApp({startLabel: 'main', width: SCREEN_X, height: SCREEN_Y, assets: ASSETS});
    app.run();
});