var field = document.getElementById("field");

field.onclick = function (e) {
    e=e||window.event;
    if(e.pageX||e.pageY){
        movex = e.pageX-parseInt(field.offsetLeft)-41;
        movey = e.pageY-parseInt(field.offsetTop)-41;
    }

    var arr=game.getPoints(movex,movey);
    game.down(arr[0],arr[1],(game.step+2)%2); //0是白子 1是黑子

};

function GAME (){
    this.step = -1;
    this.fiveGroup=[];
    this.imgObj = [];
    this.points = [];
    //纵向
    for(var y=1;y<=15;y++){
        for(var x=1;x<=11;x++){
            this.fiveGroup.push([[x,y],[x+1,y],[x+2,y],[x+3,y],[x+4,y]])
        }
    }
    //横向
    for(var x=1;x<=15;x++){
        for(var y=1;y<=11;y++){
            this.fiveGroup.push([[x,y],[x,y+1],[x,y+2],[x,y+3],[x,y+4]])
        }
    }
    //左半边
    for(var y=5;y<=15;++y){
        for (var l=1;l<y-4;++l)
            this.fiveGroup.push([[l,y],[l+1,y-1],[l+2,y-2],[l+3,y-3],[l+4,y-4]])
    }
    //右半边
    for(var x=2;x<=11;++x){
        for (var l=15;l<x+3;l--)
            this.fiveGroup.push([[x,l],[x+1,l-1],[x+2,l-2],[x+3,l-3],[x+4,l-4]]);
    }

    //左部分

    for(var x=11;x>=1;x--){
        for (var l=1;l<12;l++)
            this.fiveGroup.push([[x,l],[x+1,l+1],[x+2,l+2],[x+3,l+3],[x+4,l+4]]);
    }

    //右部分
    for(var y=5;y<=15;++y){
        for (var l=1;l<12-y;l++)
            this.fiveGroup.push([[y,l],[y+1,l+1],[y+2,l+2],[y+3,l+3],[y+4,l+4]]);
    }

}



GAME.prototype = {
    getPoints:function (x,y) {
        var X,Y,flag=0;
        for (var i=1;i<=15;i++){
            if (x<=(i-1)*40+21&&x>(i-1)*40-21) X=i;
            if (y<=(i-1)*40+21&&y>(i-1)*40-21) Y=i;
        }

        this.points.forEach(arr=>{
            if (arr[0]==X&&arr[1]==Y) flag=1;
        })
        if(flag)return ;
        return[X,Y];
    },

    drawChess:function (i){
        var img = new Image();
        img.attr({
            'src':'img/'+(this.points[i][2]==1?'black':'white')+'.png',
            'class':'chess'
        })
        img.css({
            'margin-left':(this.points[i][0]-1)*40-15+'px',
            'margin-top':(this.points[i][1]-1)*40-15+'px',
        })
        $('#field').append(img);

    },

    down:function (x,y,color){
        this.step++;
        this.points.push([x,y,color]);
        this.drawChess(this.step);
    }

};

var game = new GAME();



