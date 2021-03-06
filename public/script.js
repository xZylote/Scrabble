const date = new Date();
const socket = io('ws://localhost:8080')
var board = new Array(225)
var bag = ["E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "S_1", "S_1", "S_1", "S_1", "S_1", "S_1", "S_1", "I_1", "I_1", "I_1", "I_1", "I_1", "I_1", "R_1", "R_1", "R_1", "R_1", "R_1", "R_1", "T_1", "T_1", "T_1", "T_1", "T_1", "T_1", "U_1", "U_1", "U_1", "U_1", "U_1", "U_1", "A_1", "A_1", "A_1", "A_1", "A_1", "D_1", "D_1", "D_1", "D_1", "H_2", "H_2", "H_2", "H_2", "M_3", "M_3", "M_3", "M_3", "G_2", "G_2", "G_2", "L_2", "L_2", "L_2", "O_2", "O_2", "O_2", "B_3", "B_3", "C_4", "C_4", "F_4", "F_4", "K_4", "K_4", "W_3", "Z_3", "P_4", "J_6", "V_6", "X_8", "Q_10", "Y_10"]

var draggedOrigin, row, column, turn, username
var scores = []
var changedFields = []
var toBeRemoved = []
var firstMove = true
var rerollOn = false
var idIndex = 300

// Pull all data from the server and overwrite local game
function refresh() {
    socket.emit('getUpdate')
}

// Handle data from the server

socket.on('boardResponse', (res) => {
    console.log("received board")
    board = new Array(225).fill(null)
    for (item in res) {
        board[item] = res[item]
    }
    loadBoard()
})
socket.on('turnResponse', (res) => {
    turn = res
    colorActivePlayer()
    if (turn != username) {
        for (let i = 0; i < board.length; i++) {
            document.getElementById(i).ondragover = ""
        }
    } else {
        for (let i = 0; i < board.length; i++) {
            if (board[i] == null) {
                document.getElementById(i).setAttribute("ondragover", "allowDrop(event)")
            }
        }
    }
});
socket.on('bagResponse', (res) => {
    bag = res
})
socket.on('scoreResponse', (res) => {
    scores = res
})

socket.on('playerListUpdate', (res) => {
    document.getElementById("players").innerHTML = ""
    for (item of res) {
        var player = document.createElement("li")
        player.innerHTML = item
        document.getElementById("players").appendChild(player)
    }
})
socket.on('newPlayerAnnouncement', (res) => {
    document.getElementById("chat").innerHTML += "--- --- --- --- --- ---" + "<br>" + res + " joined" + " (" + date.getHours() + ":"
        + date.getMinutes() + ")" + "<br>" + "--- --- --- --- --- ---" + "<br>"
})

socket.on('newMessage', (res) => {
    document.getElementById("chat").innerHTML += "<br>" + res
})

// Calculate points
function updateScore(words) {
    for (item in words) {
        if (words[item].length > 1) {
            scores[username] += getWordPoints(words[item])
        }
    }
    console.log(scores)
    socket.emit('setScores')
}

function getWordPoints(word) {
    var sum = 0;
    for (letter of word) {
        sum += getLetterPoints(letter)
    }
    return sum;
}

function reset() {
    var newscores = []
    var newboard = new Array(225)
    var newbag = ["E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "S_1", "S_1", "S_1", "S_1", "S_1", "S_1", "S_1", "I_1", "I_1", "I_1", "I_1", "I_1", "I_1", "R_1", "R_1", "R_1", "R_1", "R_1", "R_1", "T_1", "T_1", "T_1", "T_1", "T_1", "T_1", "U_1", "U_1", "U_1", "U_1", "U_1", "U_1", "A_1", "A_1", "A_1", "A_1", "A_1", "D_1", "D_1", "D_1", "D_1", "H_2", "H_2", "H_2", "H_2", "M_3", "M_3", "M_3", "M_3", "G_2", "G_2", "G_2", "L_2", "L_2", "L_2", "O_2", "O_2", "O_2", "B_3", "B_3", "C_4", "C_4", "F_4", "F_4", "K_4", "K_4", "W_3", "Z_3", "P_4", "J_6", "V_6", "X_8", "Q_10", "Y_10"]
    socket.emit('setScores', newscores);
    socket.emit('setBoard', newboard);
    socket.emit('setBag', newbag);
    localStorage.setItem('username', "")
    window.location.reload()
}

// Javascript array to HTML
function loadBoard() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] != null) {
            var letter = document.createElement("td")
            letter.setAttribute("id", idIndex + 1000)
            idIndex++
            letter.setAttribute("class", "letter")
            letter.classList.add("setInStone")
            letter.innerHTML = board[i]
            console.log(letter)
            console.log(letter.childNodes[0])
            document.getElementById(i).ondragover = ""
            document.getElementById(i).innerHTML = ""
            document.getElementById(i).appendChild(letter)
            firstMove = false
        }
    }
}

// Swap letters toggle
function replace() {

    if (!rerollOn) {
        document.getElementById("donebtn").setAttribute("onclick", "donereroll()")
        document.getElementById("donebtn").disabled = false
        document.getElementById("rerollbtn").style.background = "red"
        document.getElementById("rerollbtn").textContent = "Cancel"
        var letters = document.getElementsByClassName("letter")

        for (item of letters) {
            if (!item.classList.contains("setInStone")) {
                item.setAttribute("onclick", "turnRed(event)")
            }
        }

        rerollOn = true
    } else {
        document.getElementById("donebtn").setAttribute("onclick", "done()")
        document.getElementById("donebtn").disabled = true
        document.getElementById("rerollbtn").style.background = "#054d05"
        document.getElementById("rerollbtn").textContent = "Reroll"
        var letters = document.getElementsByClassName("letter")

        for (item of letters) {
            if (!item.classList.contains("setInStone")) {
                item.setAttribute("onclick", "returnLetter(event)")
            }
            if (item.classList.contains("selected")) {
                item.classList.remove("selected")
            }
        }

        rerollOn = false
    }
}

function turnRed(e) {
    if (!e.target.classList.contains("selected")) {
        e.target.classList.add("selected")
        toBeRemoved.push(e.target.id)
    } else {
        e.target.classList.remove("selected")
        toBeRemoved = toBeRemoved.filter(item => item !== e.target.id)
    }
}

// Finish swapping letters
function donereroll() {
    if (changedFields.length > 0) {
        alert("Before doing that, you need to pick up all letters from the board")
    } else {
        if (turn == username) {

            document.getElementById("rerollbtn").style.background = "#054d05"
            document.getElementById("rerollbtn").textContent = "Reroll"
            var letters = document.getElementsByClassName("selected")
            var lettersputback = []

            for (let i = letters.length - 1; i >= 0; i--) {
                console.log(letters.item(i).innerHTML)
                lettersputback.push(letters.item(i).innerHTML.replace("<sub>", "_").replace("</sub>", ""))
                document.getElementById("playableL").removeChild(letters.item(i))
                draw(1)
            }

            for (let i = 0; i < lettersputback.length; i++) {
                bag.push(lettersputback[i])
            }

            document.getElementById("donebtn").setAttribute("onclick", "done()")
            document.getElementById("donebtn").disabled = true
            document.getElementById("rerollbtn").style.background = "#054d05"
            var letters = document.getElementsByClassName("letter")
            for (item of letters) {
                if (!item.classList.contains("setInStone")) {
                    item.setAttribute("onclick", "returnLetter(event)")
                }
                if (item.classList.contains("selected")) {
                    item.classList.remove("selected")
                }
            }

            rerollOn = false

            socket.emit('done', username);

        } else {
            document.getElementById("chat").innerHTML += "<br>" + "It's not your turn"
        }
    }
}

// Draw letters from the bag
function draw(x) {

    for (let i = 0; i < x; i++) {
        if (bag.length > 0) {
            console.log("drawing " + x)
            var letter = document.createElement("td")
            var value = document.createElement("sub")
            letter.setAttribute("id", idIndex)
            idIndex++
            letter.setAttribute("class", "letter")
            letter.setAttribute("draggable", "true")
            letter.setAttribute("ondragstart", "drag(event)")
            letter.setAttribute("onclick", "returnLetter(event)")
            var index = Math.floor(Math.random() * bag.length)
            var item = bag[index]

            if (index > -1) {
                bag.splice(index, 1)
            }

            letter.innerHTML = item.split("_")[0]
            value.innerHTML = item.split("_")[1]

            letter.appendChild(value)
            document.getElementById("playableL").appendChild(letter)
        }
    }
    socket.emit('setBag', bag);
}

// Interactive drag and drop
function allowDrop(e) {
    e.preventDefault()
}

function drag(e) {
    e.dataTransfer.setData("text", e.target.id)
    draggedOrigin = e.target.parentElement
}

function drop(e) {
    if (turn == username) {
        e.preventDefault()
        changedFields = changedFields.filter(item => item !== parseInt(draggedOrigin.id))
        draggedOrigin.setAttribute("ondragover", "allowDrop(event)")
        var data = e.dataTransfer.getData("text")

        if (e.target.id != data) {
            e.target.appendChild(document.getElementById(data))
            changedFields.push(parseInt(e.target.id))
            e.target.ondragover = ""
        }

        checkvalid()
    }
}

// Click on letter to put it back 
function returnLetter(e) {
    e.target.parentElement.setAttribute("ondragover", "allowDrop(event)")
    changedFields = changedFields.filter(item => item !== parseInt(e.target.parentElement.id))
    document.getElementById("playableL").appendChild(document.getElementById(e.target.id))
    checkvalid()
}

// Button enabled when making a valid move (no dictionary check)
function done() {
    // Register all new words that appear
    var allwords = []
    if (row) {
        for (var j = 0; j < changedFields.length; j++) {
            var wordStartIndexV = changedFields[j] - 15

            while (changedFields.includes(wordStartIndexV) || board[wordStartIndexV] != null) {
                wordStartIndexV -= 15
            }

            cont = true
            i = 15
            word = ""

            while (cont) {
                if (changedFields.includes(wordStartIndexV + i)) {
                    word += document.getElementById(wordStartIndexV + i).childNodes[0].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "").substr(0, 1)
                } else if (board[wordStartIndexV + i] != null) {
                    word += board[wordStartIndexV + i]
                } else {
                    cont = false
                }

                i += 15
            }

            allwords.push(word)
        }
        var wordStartIndexH = changedFields[0] - 1

        while (changedFields.includes(wordStartIndexH) || board[wordStartIndexH] != null) {
            wordStartIndexH--
        }

        var cont = true
        var i = 1
        var word = ""

        while (cont) {
            if (changedFields.includes(wordStartIndexH + i)) {
                word += document.getElementById(wordStartIndexH + i).childNodes[0].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "").substr(0, 1)
            } else if (board[wordStartIndexH + i] != null) {
                word += board[wordStartIndexH + i]
            } else {
                cont = false
            }

            i++
        }

        allwords.push(word)

    } else if (column) {
        for (var j = 0; j < changedFields.length; j++) {
            var wordStartIndexH = changedFields[j] - 1

            while (changedFields.includes(wordStartIndexH) || board[wordStartIndexH] != null) {
                wordStartIndexH--
            }

            cont = true
            i = 1
            word = ""

            while (cont) {
                if (changedFields.includes(wordStartIndexH + i)) {
                    word += document.getElementById(wordStartIndexH + i).childNodes[0].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "").substr(0, 1)
                } else if (board[wordStartIndexH + i] != null) {
                    word += board[wordStartIndexH + i]
                } else {
                    cont = false
                }

                i++
            }

            allwords.push(word)
        }

        var wordStartIndexV = changedFields[0] - 15

        while (changedFields.includes(wordStartIndexV) || board[wordStartIndexV] != null) {
            wordStartIndexV -= 15
        }

        cont = true
        i = 15
        word = ""

        while (cont) {
            if (changedFields.includes(wordStartIndexV + i)) {
                word += document.getElementById(wordStartIndexV + i).childNodes[0].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "").substr(0, 1)
            } else if (board[wordStartIndexV + i] != null) {
                word += board[wordStartIndexV + i]
            } else {
                cont = false
            }

            i += 15
        }
        allwords.push(word)
    }

    // Dictionary check
    validwords = true

    for (item of allwords) {

        if (!dictionary.includes(item) && item.length > 1) {
            validwords = false
            console.log()
            document.getElementById("chat").innerHTML += "<br>" + '"' + item + '"' + " invalid"
        }

        if (firstMove && changedFields.length == 1 && !dictionary.includes(item)) {
            validwords = false
            console.log('"' + item + '"' + " invalid")
            document.getElementById("chat").innerHTML += "<br>" + '"' + item + '"' + " invalid"
        }
    }

    if (validwords) {
        if (turn == username) {
            updateScore(allwords);
            if (firstMove) {
                firstMove = false
            }

            for (item of changedFields) {
                document.getElementById(item).childNodes[0].setAttribute("draggable", "false")
                document.getElementById(item).childNodes[0].setAttribute("onclick", "")
                document.getElementById(item).childNodes[0].classList.add("setInStone")
                document.getElementById(item).childNodes[0].childNodes[1].setAttribute("onclick", "")
                board[item] = document.getElementById(item).childNodes[0].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "").substr(0, 1)
            }

            draw(changedFields.length)
            changedFields = []
            checkvalid()
            socket.emit('setBoard', board);
            console.log("sent board")

            socket.emit('done', username);

        } else {
            document.getElementById("chat").innerHTML += "<br>" + "It's not your turn"
        }
    }
}

// Checks whether a move is valid regardless of its occurence in the dictionary
function checkvalid() {

    row = true
    column = true

    changedFields.sort((a, b) => a - b)
    document.getElementById("donebtn").disabled = true
    if (changedFields.length != 0) {

        var numberRow = Math.floor(changedFields[0] / 15)
        for (item of changedFields) {
            if (!(item >= (numberRow * 15) && item < (numberRow + 1) * 15)) {
                row = false
            }
        }

        for (item of changedFields) {
            if (item % 15 != changedFields[0] % 15) {
                column = false
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
                    var adjacent = true
                    if (row && !column) {
                        for (var i = 0; i < changedFields.length; i++) {
                            if (!((board[changedFields[i] + 1] != null || changedFields.includes(changedFields[i] + 1)) || (board[changedFields[i] - 1] != null || changedFields.includes(changedFields[i] - 1)))) {
                                adjacent = false
                            }
                        }

                    } else if (column && !row) {
                        var adjacent = true
                        for (var i = 0; i < changedFields.length; i++) {
                            if (!((board[changedFields[i] + 15] != null || changedFields.includes(changedFields[i] + 15)) || (board[changedFields[i] - 15] != null || changedFields.includes(changedFields[i] - 15)))) {
                                adjacent = false
                            }
                        }

                    } else {
                        alert("something went wrong")
                    }

                    for (item of changedFields) {
                        if (board[item + 1] != null || board[item - 1] != null || board[item + 15] != null || board[item - 15] != null) {
                            connected = true
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

// Enable pressing Enter for username selection and chat message

document.getElementById("chatfield").addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        if (document.getElementById("chatfield").value == "/reset") {
            reset()
        } else {
            socket.emit('say', username + " (" + date.getHours() + ":"
                + date.getMinutes() + ") - " + document.getElementById("chatfield").value);
            document.getElementById("chatfield").value = ""
        }
    }
});

document.getElementById("usernamefield").addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        username = document.getElementById("usernamefield").value;
        document.getElementById("username").style.display = "none";
        document.getElementById("alleee").style.display = "grid";
        socket.emit('playerconnect', username);
        localStorage.setItem('username', username);
        refresh()
        draw(8)
    }
});

// Inform server of disconnect

window.addEventListener("beforeunload", function (e) {
    socket.emit('dc', username);
});

/* if (localStorage.getItem('username')) {
    username = localStorage.getItem('username')
    document.getElementById("username").style.display = "none";
    document.getElementById("alleee").style.display = "grid";
    socket.emit('playerconnect', username);
    refresh()
    draw(8)
} */

function colorActivePlayer() {
    var playerlist = document.getElementById("players").getElementsByTagName("li");
    for (player of playerlist) {
        if (turn == player.innerText) {
            player.style.backgroundColor = "red"
        } else {
            player.style.backgroundColor = "#242424"
        }
    }
}

function start() {
    document.getElementById("startbtn").style.display = "none"
}