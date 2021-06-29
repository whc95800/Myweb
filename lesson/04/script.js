var areaDiv = document.getElementById("areaDiv");
var showMsg = document.getElementById("showMsg");

areaDiv.onmousemove = function (ev) {
    ev=ev||window.ev;
    var x =ev.clientX;
    var y =ev.clientY;

    showMsg.innerHTML="x="+x+","+"y="+y;
}