var gameState = require('./gameState');
var UUID = require('uuid-js');
var _ = require('underscore');
var Crypto = require('cryptojs').Crypto;
var randomstring = require('randomstring');


var quiz = new gameState.Quiz();
var secret = 'kIdNnQ<2Yic4x)BG(=TfAf%xXXHcZ#';

function verifyHost(socket, callback) {
    var token = randomstring.generate(30);
    var hashed = Crypto.HMAC(Crypto.SHA256, token, secret);
    socket.emit('host auth challenge', token, function (response) {
        if (response === hashed) {
            callback();
        }
    });
}

function bindPlayerDetailsReceived(socket) {
    // If this connection already has a player on it, update the player's details,
    // else save the new player to the db and associate it with this connection
    socket.on('player details', function (data, fn) {
        if (data.uuid) { // But data from a previous session
            quiz.modifyPlayer(data, function (err, result) {
                if (result.success) {
                    fn({success: true, playerDetails: data});
                    socket.set('playerDetails', data);
                    socket.broadcast.emit('player details updated', data);
                    socket.emit('state updated', {state: quiz.getState()});
                } else {
                    fn({success: false, errors: result.errors});
                }
            });
        } else { // Has never played before
            var uuid = UUID.create().toString();
            _.extend(data, {uuid: uuid});
            quiz.addPlayer(data, function (err, result) {
                if (result.success) {
                    fn({success: true, playerDetails: data});
                    socket.set('playerDetails', data);
                    socket.broadcast.emit('player details updated', data);
                    socket.emit('state updated', {state: quiz.getState()});
                } else {
                    fn({success: false, errors: result.errors});
                }
            });
        }
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
        verifyHost(socket, function () {
            quiz.updateState(data.state);
            socket.emit('state updated', data);
            socket.broadcast.emit('state updated', data);
        });
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
        verifyHost(socket, function () {
            quiz.changeScore(data, function (error, scores) {
                if (!error) {
                    socket.emit('scores updated', scores);
                    socket.broadcast.emit('scores updated', scores);
                }
            });
        });
    });
}

function bindDisconnect(socket) {
    socket.on('disconnect', function () {
        socket.get('playerDetails', function (err, details) {
            if (details) {
                quiz.removePlayer(details, function () {
                    socket.broadcast.emit('player disconnected', {uuid: details.uuid});
                });
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
    bindDisconnect(socket);

    requestPlayerDetails(socket);
    sendScores(socket);
};