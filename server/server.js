const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { orgin: "*" }
});

var index = 1
var players = []
var board = new Array(225)
var bag = ["E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "E_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "N_1", "S_1", "S_1", "S_1", "S_1", "S_1", "S_1", "S_1", "I_1", "I_1", "I_1", "I_1", "I_1", "I_1", "R_1", "R_1", "R_1", "R_1", "R_1", "R_1", "T_1", "T_1", "T_1", "T_1", "T_1", "T_1", "U_1", "U_1", "U_1", "U_1", "U_1", "U_1", "A_1", "A_1", "A_1", "A_1", "A_1", "D_1", "D_1", "D_1", "D_1", "H_2", "H_2", "H_2", "H_2", "M_3", "M_3", "M_3", "M_3", "G_2", "G_2", "G_2", "L_2", "L_2", "L_2", "O_2", "O_2", "O_2", "B_3", "B_3", "C_4", "C_4", "F_4", "F_4", "K_4", "K_4", "W_3", "Z_3", "P_4", "J_6", "V_6", "X_8", "Q_10", "Y_10"]
var scores = []
var turn = 0


io.on('connection', (socket) => {

    socket.on('say', (value) => {
        io.emit('newMessage', value);
    });

    socket.on('playerconnect', (value) => {
        var player = {
            socket : socket.id,
            index : index++,
            name : value
        }
        if (players.includes(player)) {
            console.log("the retard logged in twice")
        }
        console.log("Player " + player + " connected")
        players.push(player)
        if (players.length == 1) {
            turn = players[0]
        }
        io.emit('newPlayerAnnouncement', player)
        io.emit('playerListUpdate', players);
        io.emit('turnResponse', turn);
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

    socket.on('clearScores', () => {
        players = []
        io.emit('playerListUpdate', players);
    })

    socket.on('done', (value) => {
        turn = (turn + 1) % players.length
        io.emit('turnResponse', players[turn].name);
    });

    socket.on('setBag', (value) => {
        bag = value
    });

    socket.on('disconnect', (username) => {
        players.filter(function(player) { return player.name == username; });
        io.emit('playerListUpdate', players);
    });

});

http.listen(process.env.PORT || 8080);