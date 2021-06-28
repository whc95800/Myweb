var checkedAllBtn = document.getElementById("checkedAllBtn");
var items = document.getElementsByName("items");
checkedAllBtn.onclick = function () {
    for (var i=0;i<items.length;i++){
        items[i].checked=true;
    }
    checkedAllBox.checked = true;
};

var checkedNoBtn = document.getElementById("checkedNoBtn");
checkedNoBtn.onclick = function () {
    for (var i=0;i<items.length;i++){
        items[i].checked=false;
    }
    checkedAllBox.checked = false;
};

var checkedRevBtn = document.getElementById("checkedRevBtn");
checkedRevBtn.onclick = function () {
    checkedAllBox.checked = true;
    for (var i=0;i<items.length;i++){
        items[i].checked=!items[i].checked;
        if(!items[i].checked){
            checkedAllBox.checked = false;
        }
    }
};

var sendBtn = document.getElementById("sendBtn");
sendBtn.onclick = function(){
    for(var i=0 ; i<items.length ; i++){
        if(items[i].checked){
            alert(items[i].value);
        }
    }
};


var checkedAllBox= document.getElementById("checkedAllBox");
checkedAllBox.onclick = function(){
    for(var i=0; i <items.length ; i++){
        items[i].checked = this.checked;
    }
};

for(var i=0 ; i<items.length ; i++){
    items[i].onclick = function(){
        checkedAllBox.checked = true;
        for(var j=0 ; j<items.length ; j++){
            if(!items[j].checked){
                checkedAllBox.checked = false;
                break;
            }
        }
    }
}