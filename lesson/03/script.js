var allA = document.getElementsByTagName("a");
function delA(){
    var tr = this.parentNode.parentNode;
    var name =tr.getElementsByTagName("td")[0].innerHTML;
    var conf = confirm("确认删除"+name+"么？");
    if (conf){
        tr.parentNode.removeChild(tr);
    }
    return false;
}
for (var i=0;i<allA.length;i++){
    allA[i].onclick=delA;
}

var addEmpButton = document.getElementById("addEmpButton");
addEmpButton.onclick=function () {
    var empname = document.getElementById("empName").value;
    var email = document.getElementById("email").value;
    var salary = document.getElementById("salary").value;
    var tr=document.createElement("tr");

    tr.innerHTML=
        "<td>"+empname+"</td>"+
        "<td>"+email+"</td>"+
        "<td>"+salary+"</td>"+
        "<td><a href='javascript:;'>Delete</a></td>";
    var employeeTable = document.getElementById("employeeTable");
    var tbody = employeeTable.getElementsByTagName("tbody")[0];
    tbody.appendChild(tr);
    for (var i=0;i<allA.length;i++){
        allA[i].onclick=delA;
    }
}