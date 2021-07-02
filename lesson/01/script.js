function myClick(idStr,fun) {
    var btn = document.getElementById(idStr);
    btn.onclick=fun;
}

var btn01 = document.getElementById("btn01");
btn01.onclick=function (){
    var bj =document.getElementById("bj");
    alert(bj.innerHTML);
};

var btn02 =document.getElementById("btn02");
btn02.onclick=function (){
    var lis =document.getElementsByTagName("li");
    for(var i=0;i<lis.length;i++){
        alert(lis[i].innerHTML);
    }
};

var btn03 =document.getElementById("btn03");
btn03.onclick=function (){
    var inputs = document.getElementsByName("gender");
    for(var i=0;i<inputs.length;i++){
        alert(inputs[i].value);
    }
};

var btn04 =document.getElementById("btn04");
btn04.onclick=function (){
    var city = document.getElementById("city");
    var lis = city.getElementsByTagName("li");
    for (var i=0;i<lis.length;i++){
        alert(lis[i].innerHTML);
    }
};

var btn05 =document.getElementById("btn05");
btn05.onclick=function () {
    var city = document.getElementById("city");
    var cns = city.children;
    alert(cns.length);
};

var btn06 =document.getElementById("btn06");
btn06.onclick=function () {
    var phone = document.getElementById("phone");
    var p1 = phone.firstChild;
    alert(p1.innerHTML);
};

var btn07 =document.getElementById("btn06");
btn07.onclick=function () {
    var bj = document.getElementById("bj");
    var pn =bj.parentNode;
    alert(pn.innerText);
};


myClick("btn07",function (){
        var bj = document.getElementById("bj");
        var pn =bj.parentNode;
        alert(pn.innerText);
});