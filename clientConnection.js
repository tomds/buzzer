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
            socket.broadcast.emit('player details updated', data);

            fn({success: true, playerDetails: data});

            socket.emit('state updated', {state: quiz.getState()});
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
        quiz.updateState(data.state);
        socket.emit('state updated', data);
        socket.broadcast.emit('state updated', data);
    });
}

function requestPlayerDetails(socket) {
    socket.emit('request player details');
}

function sendScores(socket) {
    quiz.getScores(function (err, scores) {
        socket.emit('scores updated', scores);
    });
}

function bindRequestState(socket) {
    socket.on('request state', function () {
        socket.emit('state updated', {state: quiz.getState()});
    });
}

function bindBuzz(socket) {
    socket.on('buzz', function (fn) {
        if (quiz.getState() === 'buzzersActive') {
            quiz.updateState('buzzersInactive');
            socket.broadcast.emit('state updated', {state: 'buzzersInactive'});
            socket.emit('state updated', {state: 'buzzersInactive'});

            socket.get('playerDetails', function (err, data) {
                socket.broadcast.emit('player buzzed', data);
            });

            fn({success: true});
        } else {
            fn({success: false});
        }
    });
}

function bindChangeScore(socket) {
    socket.on('host change score', function (data) {
        quiz.changeScore(data, function (error, scores) {
            if (!error) {
                socket.emit('scores updated', scores);
                socket.broadcast.emit('scores updated', scores);
            }
        });
    });
}

exports.init = function (socket) {
    bindPlayerDetailsReceived(socket);
    bindHostRequestTeamList(socket);
    bindUpdateState(socket);
    bindRequestState(socket);
    bindBuzz(socket);
    bindChangeScore(socket);

    requestPlayerDetails(socket);
    sendScores(socket);
};