const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { orgin: "*" }
});

var players = []
var board = new Array(225)
var bag = ["E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "S_1", "S_1", "S_1", "S_1", "S_1", "S_1", "S_1", "I_1", "I_1", "I_1", "I_1", "I_1", "I_1", "R_1", "R_1", "R_1", "R_1", "R_1", "R_1", "T_1", "T_1", "T_1", "T_1", "T_1", "T_1", "U_1", "U_1", "U_1", "U_1", "U_1", "U_1", "A_1", "A_1", "A_1", "A_1", "A_1", "D_1", "D_1", "D_1", "D_1", "H_2", "H_2", "H_2", "H_2", "M_3", "M_3", "M_3", "M_3", "G_2", "G_2", "G_2", "L_2", "L_2", "L_2", "O_2", "O_2", "O_2", "B_3", "B_3", "C_4", "C_4", "F_4", "F_4", "K_4", "K_4", "W_3", "Z_3", "P_4", "J_6", "V_6", "X_8", "Q_10", "Y_10"]
var scores = []
var turn = "no User"


io.on('connection', (socket) => {

    socket.on('say', (value) => {
        io.emit('newMessage', value);
    });

    socket.on('playerconnect', (value) => {
        if (players.includes(value)) {
            console.log("the retard logged in twice")
        }
        console.log("Player " + value + " connected")
        players.push(value)
        if (players.length == 1) {
            turn = players[0]
        }
        io.emit('newPlayerAnnouncement', value)
        io.emit('playerListUpdate', players);
    });

    socket.on('setBoard', (value) => {
        board = value
        io.emit('boardResponse', board);
    });
    socket.on('setScores', (value) => {
        board = value
        io.emit('scoreResponse', scores);
    });
    socket.on('setTurn', (value) => {
        turn = value
        io.emit('turnResponse', turn);
    });
    socket.on('getUpdate', () => {
        io.emit('turnResponse', turn);
        io.emit('boardResponse', board);
        io.emit('bagResponse', bag);
        io.emit('scoreResponse', scores);
    });

    socket.on('done', (value) => {
        if (players.indexOf(value) + 1 != players.length) {
            turn = players[players.indexOf(value) + 1];
        }
        else {
            turn = players[0]
        }
        io.emit('turnResponse', turn);
    });

    socket.on('setBag', (value) => {
        bag = value
    });

    socket.on('dc', (value) => {
        const index = players.indexOf(value);
        if (index > -1) {
            players.splice(index, 1);
        }
        console.log("Player " + value + " disconnected")
        io.emit('playerListUpdate', players);
    });

});

http.listen(process.env.PORT || 8080);