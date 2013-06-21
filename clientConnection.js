var gameState = require('./gameState');
var UUID = require('uuid-js');
var _ = require('underscore');


var quiz = new gameState.Quiz();

function bindPlayerDetailsReceived (socket) {
    // If this connection already has a player on it, update the player's details,
    // else save the new player to the db and associate it with this connection
    socket.on('player details', function (data, fn) {
        socket.get('playerDetails', function (err, playerDetails) {
            var uuid;

            if (!playerDetails) { // No player details attached to socket
                if (data.uuid) { // But data from a previous session
                    uuid = data.uuid;
                    quiz.modifyPlayer(uuid, data);
                } else { // Has never played before
                    uuid = UUID.create().toString();
                    quiz.addPlayer(uuid, data);
                }
            } // Else has an active session on this socket

            _.extend(data, {uuid: uuid});

            socket.set('playerDetails', data);
            
            fn({success: true, playerDetails: data});
            socket.broadcast.emit('player details updated', data);
        });
    });
}

function bindHostRequestTeamList(socket) {
    socket.on('host request team list', function (fn) {
        quiz.getAllPlayers(function (players) {
            fn({players: players});
        });
    });
}

function bindUpdateState(socket) {
    socket.on('host update state', function (data) {
        quiz.updateState(data.state, function () {
            socket.emit('state updated', data);
            socket.broadcast.emit('state updated', data);
        });
    });
}

function requestPlayerDetails(socket) {
    socket.emit('request player details');
}

function sendInitialState(socket) {

}

exports.init = function (socket) {
    bindPlayerDetailsReceived(socket);
    bindHostRequestTeamList(socket);
    bindUpdateState(socket);

    requestPlayerDetails(socket);
};