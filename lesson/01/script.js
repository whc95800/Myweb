var btn01 = document.getElementById("btn01");
btn01.onclick=function (){
    var bj =document.getElementById("bj");
    alert(bj.innerHTML);
};

var btn02 =document.getElementById("btn02");
btn02.onclick=function (){
    var lis =document.getElementsByTagName("li")
    for(var i=0;i<lis.length;i++){
        alert(lis[i].innerHTML);
    }
}

var btn03 =document.getElementById("btn03");
btn03.onclick=function (){
    var inputs = document.getElementsByName("gender");
    for(var i=0;i<inputs.length;i++){
        alert(inputs[i].value);
    }
}

var btn04 =document.getElementById("btn04");
btn04.onclick=function (){
    var lis = document.getElementsByName("city");
    for(var i=0;i<lis.length;i++){
        alert(lis[i].innerHTML);
    }
}
