var prev = document.getElementById("prev");
var next = document.getElementById("next");
var img = document.getElementsByTagName("img")[0];
var imgArr = ["img/1.jpg","img/2.jpg","img/3.jpg","img/4.jpg","img/5.jpg"]
var index = 0;
var info = document.getElementById("info");

prev.onclick = function () {
    index--;
    if (index<0){
        index=(imgArr.length-1);
    }
    img.src = imgArr[index];
    info.innerHTML = "一共"+(imgArr.length)+"张图片，当前第"+(index+1)+"张";
};
next.onclick = function () {
    index++;
    if (index>imgArr.length-1){
        index=0;
    }
    img.src = imgArr[index];
    info.innerHTML = "一共"+(imgArr.length)+"张图片，当前第"+(index+1)+"张";
};

