
var prev = document.getElementById("prev");
var next = document.getElementById("next");
var img = document.getElementsByTagName("img")[0];
var imgs = ["img/1.jpg","img/2.jpg","img/3.jpg","img/4.jpg","img/5.jpg"];
var index=0;
var info = document.getElementById("info");
info.innerHTML="合計"+imgs.length+"ページ、現在"+(index+1)+"ページ。"
prev.onclick=function (){
    index--;
    if (index<0){
        index=4;
    }
    img.src=imgs[index];
    info.innerHTML="合計"+imgs.length+"ページ、現在"+(index+1)+"ページ。"
}
next.onclick=function (){
    index++;
    if (index>4){
        index=0;
    }
    img.src=imgs[index];
    info.innerHTML="合計"+imgs.length+"ページ、現在"+(index+1)+"ページ。"
}
