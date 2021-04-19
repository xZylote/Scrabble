const board = new Array(225).fill(null);
var changedFields = [];
var draggedOrigin;
var firstMove = true;

function allowDrop(e) {
    e.preventDefault();
}
  
function drag(e) {
    e.dataTransfer.setData("text", e.target.id);
    draggedOrigin = e.target.parentElement;
}
  
function drop(e) {
    e.preventDefault(); 
    changedFields = changedFields.filter(item => item !== parseInt(draggedOrigin.id))
    draggedOrigin.setAttribute("ondragover", "allowDrop(event)")
    var data = e.dataTransfer.getData("text");
    if(e.target.id != data){
    e.target.appendChild(document.getElementById(data));
    changedFields.push(parseInt(e.target.id));
    e.target.ondragover = "";
    }
    console.log(changedFields)
    checkvalid();
}

function returnLetter(e) {
    e.target.parentElement.setAttribute("ondragover", "allowDrop(event)")
    changedFields = changedFields.filter(item => item !== parseInt(e.target.parentElement.id))
    document.getElementById("playableL").appendChild(document.getElementById(e.target.id))
    checkvalid();
}

function done() {
    if(firstMove){
        firstMove =false;
    }
    var word = "";
    changedFields.sort()
    for (item of changedFields){
        document.getElementById(item).childNodes[0].setAttribute("draggable", "false")
        document.getElementById(item).childNodes[0].setAttribute("onclick", "")
        word += document.getElementById(item).childNodes[0].innerHTML
    }
    word = word.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "");
    console.log(word)
    //CHECK DICT
    for (item of changedFields){
        board[item] = document.getElementById(item).childNodes[0].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "");
    }
    console.log(board);
    changedFields = [];
    checkvalid();
}
function checkvalid() {

    document.getElementById("donebtn").disabled = true
    if (changedFields.length != 0){
    var row = true;
    var column = true;
    var numberRow = Math.floor(changedFields[0]/15);
    for (item of changedFields){
        if (!(item >= (numberRow*15) && item < (numberRow+1)*15)){
        row = false;
        }
    }

    for (item of changedFields){
        if (item % 15 != changedFields[0] % 15){
            column = false;
        }
    }

    console.log(row, column)
    if(row || column){
        if(firstMove && changedFields.includes(112) ){
            document.getElementById("donebtn").disabled = false
        } else {
            for (item of changedFields){
                if (board[item-1] || board[item+1] || board[item-15] || board[item+15]){
                    document.getElementById("donebtn").disabled = false
                } 
            }
            
        }

    }
    }

}