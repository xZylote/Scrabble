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
    if (e.target.id != data) {
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
    if (firstMove) {
        firstMove = false;
    }
    var word = "";
    for (item of changedFields) {
        document.getElementById(item).childNodes[0].setAttribute("draggable", "false")
        document.getElementById(item).childNodes[0].setAttribute("onclick", "")
        word += document.getElementById(item).childNodes[0].innerHTML
    }
    word = word.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "");
    console.log(word)
    //CHECK DICT
    for (item of changedFields) {
        board[item] = document.getElementById(item).childNodes[0].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "");
    }
    console.log(board);
    changedFields = [];
    checkvalid();
}
function checkvalid() {
    changedFields.sort((a, b) => a - b);
    document.getElementById("donebtn").disabled = true
    if (changedFields.length != 0) {

        var row = true;
        var column = true;
        var numberRow = Math.floor(changedFields[0] / 15);
        for (item of changedFields) {
            if (!(item >= (numberRow * 15) && item < (numberRow + 1) * 15)) {
                row = false;
            }
        }

        for (item of changedFields) {
            if (item % 15 != changedFields[0] % 15) {
                column = false;
            }
        }

        console.log(row, column)
        if (row || column) {
            if (firstMove && changedFields.includes(112)) {
                var adjacent = true
                for (item of changedFields) {
                    if (!(changedFields.includes(item + 1) || changedFields.includes(item - 1) || changedFields.includes(item + 15) || changedFields.includes(item - 15))) {
                        adjacent = false
                    }
                }
                if (adjacent) {
                    document.getElementById("donebtn").disabled = false
                }
            } else {
                if (changedFields.length == 1) {
                    if (board[changedFields[0] - 1] != null || board[changedFields[0] + 1] != null || board[changedFields[0] - 15] != null || board[changedFields[0] + 15] != null) {
                        document.getElementById("donebtn").disabled = false
                    }
                } else {
                    var connected = false
                    var adjacent = true;
                    if (row && !column) {
                        for (var i = 0; i < changedFields.length; i++) {
                            if (!((board[changedFields[i] + 1] != null || changedFields.includes(changedFields[i] + 1)) || (board[changedFields[i] - 1] != null || changedFields.includes(changedFields[i] - 1)))) {
                                adjacent = false
                            }
                        }

                    } else if (column && !row) {
                        var adjacent = true;
                        for (var i = 0; i < changedFields.length; i++) {
                            if (!((board[changedFields[i] + 15] != null || changedFields.includes(changedFields[i] + 15)) || (board[changedFields[i] - 15] != null || changedFields.includes(changedFields[i] - 15)))) {
                                adjacent = false
                            }
                        }

                    }
                    else {
                        alert("something went wrong")
                    }
                    for (item of changedFields) {
                        if (board[item + 1] != null || board[item - 1] != null || board[item + 15] != null || board[item - 15] != null) {
                            connected = true;
                        }
                    }
                    if (adjacent && connected) {
                        document.getElementById("donebtn").disabled = false
                    }
                }
            }

        }
    }

}