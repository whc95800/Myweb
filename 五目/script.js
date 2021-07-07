const ROWS=15;
const COLUMNS=15;
let TURN=0;

const table = document.getElementById("field-table");
for (let y = 0; y < ROWS; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < COLUMNS; x++) {
        const box = document.createElement("td");
        const chips = document.createElement("div");
        const lastRow = document.createElement("div");
        const lastColumn = document.createElement("div");
        const lastRowColumn = document.createElement("div");
        if (x === 14){
            lastRow.className="chip last-in-row";
            box.appendChild(lastRow);
        }
        if (y === 14){
            lastColumn.className="chip last-in-column";
            box.appendChild(lastColumn);
        }
        if (x === 14&&y === 14){
            lastRowColumn.className="chip last-in-column last-in-row";
            box.appendChild(lastRowColumn);
        }
        chips.className = "chip";
        box.appendChild(chips);
        row.appendChild(box);
        chips.innerHTML="0";
    }
    table.appendChild(row);
}



function drawChip () {
        let currentBlack=document.getElementById("turn-black");
        let currentWhite=document.getElementById("turn-white");
        let arr = [];
        if (TURN%2===0&&!hasClass(this,"white")&&!hasClass(this,"black")){
            this.className += " black";
            this.innerHTML="1";
            currentBlack.className ="turn";
            currentWhite.className = "turn turn-current"
            TURN++;
        }else if(TURN%2===1&&!hasClass(this,"black")&&!hasClass(this,"white")){
            this.className +=" white";
            this.innerHTML="10";
            currentWhite.className = "turn";
            currentBlack.className = "turn turn-current"
            TURN++;
        }
        for (let i=0;i<drawChips.length;i++){
            arr[i]=drawChips[i].innerHTML;
        }
        let chipsArr = arrTrans(arr,16);
        console.log(chipsArr);

}


function hasClass (obj,cn){
    let reg = new RegExp("\\b"+cn+"\\b");
    return reg.test(obj.className);
}

const drawChips = document.getElementsByClassName("chip");

for(let i in drawChips){
    drawChips[i].onclick = drawChip;
}



function arrTrans(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}

