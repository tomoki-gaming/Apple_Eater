//リンゴ　クラス
phina.define('Apple', {
    superClass: 'Sprite',
    init: function(image,x,y,object_name) {
        this.superInit(image);
        this.size = [50,50];
        this.pad = 5;
        this.object_name = object_name;
        this.setSize(this.size[0],this.size[1]);
        this.setPosition(x,y);
    },
    update: function() {
        this.y +=1;
    },
    delete_in_mouse:function(pos){
        if(SCREEN_X-this.x>=pos[0]+this.pad && SCREEN_X-this.x<=pos[1]-this.pad){
            if(this.y>=pos[2]+this.pad && this.y<=pos[3]-this.pad){
                this.remove();
                if(this.object_name=='apple'){
                    return 100;
                }
                else{
                    return -100;
                }
            }
        }
        return 0;
    },
    delete_under_frame:function(){
        if(this.y > SCREEN_Y-15){
            this.remove();
            return 1;
        }
        return 0;
    },
});