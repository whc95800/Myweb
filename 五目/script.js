const ROWS=15;
const COLUMNS=15;
let TURN=0;
const table = document.getElementById("field-table");
for (let y = 0; y <ROWS; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < COLUMNS; x++) {
        const box = document.createElement("td");
        const chips = document.createElement("div");
        const lastRow = document.createElement("div");
        const lastColumn = document.createElement("div");
        const lastRowColumn = document.createElement("div");
        box.appendChild(chips);
        row.appendChild(box);
        if (x === 14){
            lastRow.className="chip last-in-row";
            box.appendChild(lastRow);
        }
        if (x === 14&&y === 14){
            lastRowColumn.className="chip last-in-column last-in-row";
            box.appendChild(lastRowColumn);
        }
        if (y === 14){
            lastColumn.className="chip last-in-column";
            box.appendChild(lastColumn);
        }

        chips.className = "chip";

        chips.innerHTML="0";
        lastRow.innerHTML="0";
        lastColumn.innerHTML="0";
        lastRowColumn.innerHTML="0";
    }
    table.appendChild(row);
}
function drawChip () {
        let currentBlack=document.getElementById("turn-black");
        let currentWhite=document.getElementById("turn-white");
        let win = document.getElementById("win-result");
        let arr = [];
        if(win.innerText === "white win!!!" || win.innerText === "black win!!!"){
            return false;
        }
        if (TURN%2===0&&!hasClass(this,"white")&&!hasClass(this,"black")){
            this.className += " black";
            this.innerHTML="1";
            currentBlack.className ="turn";
            currentWhite.className = "turn turn-current"
            TURN++;
        }else if(TURN%2===1&&!hasClass(this,"black")&&!hasClass(this,"white")){
            this.className +=" white";
            this.innerHTML="2";
            currentWhite.className = "turn";
            currentBlack.className = "turn turn-current"
            TURN++;
        }
        for (let i=0;i<drawChips.length;i++){
            if(i>=224){
                arr[224]=drawChips[224].innerHTML;
                arr[225]=drawChips[226].innerHTML;
                arr[226]=drawChips[228].innerHTML;
                arr[227]=drawChips[230].innerHTML;
                arr[228]=drawChips[232].innerHTML;
                arr[229]=drawChips[234].innerHTML;
                arr[230]=drawChips[236].innerHTML;
                arr[231]=drawChips[238].innerHTML;
                arr[232]=drawChips[240].innerHTML;
                arr[233]=drawChips[242].innerHTML;
                arr[234]=drawChips[244].innerHTML;
                arr[235]=drawChips[246].innerHTML;
                arr[236]=drawChips[248].innerHTML;
                arr[237]=drawChips[250].innerHTML;
                arr[238]=drawChips[252].innerHTML;
                arr[239]=drawChips[253].innerHTML;
                arr[240]=drawChips[225].innerHTML;
                arr[241]=drawChips[227].innerHTML;
                arr[242]=drawChips[229].innerHTML;
                arr[243]=drawChips[231].innerHTML;
                arr[244]=drawChips[233].innerHTML;
                arr[245]=drawChips[235].innerHTML;
                arr[246]=drawChips[237].innerHTML;
                arr[247]=drawChips[239].innerHTML;
                arr[248]=drawChips[241].innerHTML;
                arr[249]=drawChips[243].innerHTML;
                arr[250]=drawChips[245].innerHTML;
                arr[251]=drawChips[247].innerHTML;
                arr[252]=drawChips[249].innerHTML;
                arr[253]=drawChips[251].innerHTML;
                arr[254]=drawChips[255].innerHTML;
                arr[255]=drawChips[254].innerHTML;
            }
            else {
                arr[i]=drawChips[i].innerHTML;
            }
        }
        let chipsArr = arrTrans(arr,16);
        //纵向｜
        for(let y=0;y<=15;y++){
            for(let x=0;x<=11;x++){
                let winConditions =(chipsArr[x][y])*(chipsArr[x+1][y])*(chipsArr[x+2][y])*(chipsArr[x+3][y])*(chipsArr[x+4][y]);
                if(winConditions===1){
                    win.innerText="black win!!!";
                }
                if(winConditions===32){
                    win.innerText="white win!!!";
                }
            }
        }
        //横向ー
        for(let x=0;x<=15;x++){
            for(let y=0;y<=11;y++){
                let winConditions = (chipsArr[x][y])*(chipsArr[x][y+1])*(chipsArr[x][y+2])*(chipsArr[x][y+3])*(chipsArr[x][y+4]);
                if(winConditions===1){
                    win.innerText="black win!!!";
                }
                if(winConditions===32){
                    win.innerText="white win!!!";
                }
            }
        }
        //  左斜/
        for(let y=4;y<=15;y++) {
            for (let x = 0; x <=11; x++) {
                let winConditions = (chipsArr[x][y])*(chipsArr[x+1][y-1])*(chipsArr[x+2][y-2])*(chipsArr[x+3][y-3])*(chipsArr[x+4][y-4]);
                if (winConditions===1) {
                    win.innerText = "black win!!!";
                }
                if (winConditions===32) {
                    win.innerText = "white win!!!";
                }
            }
        }
        //  右斜\
        for(let x=11; x>=0; x--) {
            for (let y=0; y<=11; y++) {
                let winConditions = (chipsArr[x][y])*(chipsArr[x+1][y+1])*(chipsArr[x+2][y+2])*(chipsArr[x+3][y+3])*(chipsArr[x+4][y+4]);
                if (winConditions===1) {
                    win.innerText = "black win!!!";
                }
                if (winConditions===32) {
                    win.innerText = "white win!!!";
                }
            }
        }
}
const drawChips = document.getElementsByClassName("chip");
function hasClass (obj,cn){
    let reg = new RegExp("\\b"+cn+"\\b");
    return reg.test(obj.className);
}
 for (let i in drawChips) {
     drawChips[i].onclick = drawChip;
 }
function arrTrans(array, arrLength) {
    let index = 0;
    let newArray = [];
    while(index < array.length) {
        newArray.push(array.slice(index, index += arrLength));
    }
    return newArray;
}