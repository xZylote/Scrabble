const board = new Array(225).fill(null);
var bag = ["E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "S_1", "S_1", "S_1", "S_1", "S_1", "S_1", "S_1", "I_1", "I_1", "I_1", "I_1", "I_1", "I_1", "R_1", "R_1", "R_1", "R_1", "R_1", "R_1", "T_1", "T_1", "T_1", "T_1", "T_1", "T_1", "U_1", "U_1", "U_1", "U_1", "U_1", "U_1", "A_1", "A_1", "A_1", "A_1", "A_1", "D_1", "D_1", "D_1", "D_1", "H_2", "H_2", "H_2", "H_2", "M_3", "M_3", "M_3", "M_3", "G_2", "G_2", "G_2", "L_2", "L_2", "L_2", "O_2", "O_2", "O_2", "B_3", "B_3", "C_4", "C_4", "F_4", "F_4", "K_4", "K_4", "W_3", "Z_3", "P_4", "&Auml;_6", "J_6", "&Uuml;_6", "V_6", "&Ouml;_8", "X_8", "Q_10", "Y_10"]
var changedFields = [];
var draggedOrigin;
var firstMove = true;
var row;
var column;
var idIndex = 300;

draw(8)

function draw(x) {
    for (let i = 0; i < x; i++) {
        if (bag.length > 0) {
            var letter = document.createElement("td");
            var value = document.createElement("sub");
            letter.setAttribute("id", idIndex);
            idIndex++;
            letter.setAttribute("class", "letter")
            letter.setAttribute("draggable", "true")
            letter.setAttribute("ondragstart", "drag(event)")
            letter.setAttribute("onclick", "returnLetter(event)")
            var index = Math.floor(Math.random() * bag.length)
            var item = bag[index];
            if (index > -1) {
                bag.splice(index, 1);
            }
            letter.innerHTML = item.split("_")[0];
            value.innerHTML = item.split("_")[1];

            letter.appendChild(value);
            document.getElementById("playableL").appendChild(letter);
        }
    }
}

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
    checkvalid();
}

function returnLetter(e) {
    if (e.target.classList.contains("letter")) {
        e.target.parentElement.setAttribute("ondragover", "allowDrop(event)")
        changedFields = changedFields.filter(item => item !== parseInt(e.target.parentElement.id))
        document.getElementById("playableL").appendChild(document.getElementById(e.target.id))
    }
    else {
        e.target.parentElement.parentElement.setAttribute("ondragover", "allowDrop(event)")
        changedFields = changedFields.filter(item => item !== parseInt(e.target.parentElement.parentElement.id))
        document.getElementById("playableL").appendChild(document.getElementById(e.target.parentElement.id))
    }
    checkvalid();
}

function done() {
    var allwords = [];
    if (row) {
        for (var j = 0; j < changedFields.length; j++) {
            var wordStartIndexV = changedFields[j] - 15;
            while (changedFields.includes(wordStartIndexV) || board[wordStartIndexV] != null) {
                wordStartIndexV -= 15;
            }
            cont = true
            i = 15
            word = "";
            while (cont) {
                if (changedFields.includes(wordStartIndexV + i)) {
                    word += document.getElementById(wordStartIndexV + i).childNodes[0].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "").substr(0, 1);
                } else if (board[wordStartIndexV + i] != null) {
                    word += board[wordStartIndexV + i]
                } else {
                    cont = false
                }
                i += 15;
            }
            allwords.push(word)
        }
        var wordStartIndexH = changedFields[0] - 1;
        while (changedFields.includes(wordStartIndexH) || board[wordStartIndexH] != null) {
            wordStartIndexH--;
        }

        var cont = true
        var i = 1
        var word = "";
        while (cont) {
            if (changedFields.includes(wordStartIndexH + i)) {
                word += document.getElementById(wordStartIndexH + i).childNodes[0].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "").substr(0, 1);
            } else if (board[wordStartIndexH + i] != null) {
                word += board[wordStartIndexH + i]
            } else {
                cont = false
            }
            i++;
        }
        allwords.push(word)

    } else if (column) {
        for (var j = 0; j < changedFields.length; j++) {
            var wordStartIndexH = changedFields[j] - 1;
            while (changedFields.includes(wordStartIndexH) || board[wordStartIndexH] != null) {
                wordStartIndexH--;
            }

            cont = true
            i = 1
            word = "";
            while (cont) {
                if (changedFields.includes(wordStartIndexH + i)) {
                    word += document.getElementById(wordStartIndexH + i).childNodes[0].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "").substr(0, 1);
                } else if (board[wordStartIndexH + i] != null) {
                    word += board[wordStartIndexH + i]
                } else {
                    cont = false
                }
                i++;
            }
            allwords.push(word)

        }


        var wordStartIndexV = changedFields[0] - 15;
        while (changedFields.includes(wordStartIndexV) || board[wordStartIndexV] != null) {
            wordStartIndexV -= 15;
        }
        cont = true
        i = 15
        word = "";
        while (cont) {
            if (changedFields.includes(wordStartIndexV + i)) {
                word += document.getElementById(wordStartIndexV + i).childNodes[0].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "").substr(0, 1);
            } else if (board[wordStartIndexV + i] != null) {
                word += board[wordStartIndexV + i]
            } else {
                cont = false
            }
            i += 15;
        }
        allwords.push(word)
    }
    validwords = true;
    for (item of allwords) {
        if (!dictionary.includes(item) && item.length > 1) {
            validwords = false;
            console.log('"' + item + '"' + " invalid")
        }
        if (firstMove && changedFields.length == 1 && !dictionary.includes(item)) {
            validwords = false
            console.log('"' + item + '"' + " invalid")
        }
    }
    if (validwords) {
        if (firstMove) {
            firstMove = false;
        }
        for (item of changedFields) {
            document.getElementById(item).childNodes[0].setAttribute("draggable", "false")
            document.getElementById(item).childNodes[0].setAttribute("onclick", "")
            document.getElementById(item).childNodes[0].classList.add("setInStone")
            document.getElementById(item).childNodes[0].childNodes[1].setAttribute("onclick", "")
            board[item] = document.getElementById(item).childNodes[0].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "").substr(0, 1);
        }
        draw(changedFields.length)
        changedFields = [];
        checkvalid();
        console.log(board)
    }
}



function checkvalid() {

    row = true;
    column = true;

    changedFields.sort((a, b) => a - b);
    document.getElementById("donebtn").disabled = true
    if (changedFields.length != 0) {

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
        if (row || column) {
            if (firstMove && changedFields.includes(112)) {
                var adjacent = true
                for (item of changedFields) {
                    if (!(changedFields.includes(item + 1) || changedFields.includes(item - 1) || changedFields.includes(item + 15) || changedFields.includes(item - 15))) {
                        adjacent = false
                    }
                }
                if (adjacent || changedFields.length == 1) {
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