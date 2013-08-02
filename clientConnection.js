var gameState = require('./gameState');
var UUID = require('uuid-js');
var _ = require('underscore');
var Crypto = require('cryptojs').Crypto;
var randomstring = require('randomstring');
var Q = require('q');
var config = require('./getConfig');

// Check we have a secret host passphrase set, and kill server if not
config.get('hostSecret')
.done(function (hostSecret) {
    if (hostSecret === undefined) {
        throw 'ERROR: No secret host passphrase found in config. Please set a' +
        ' passphrase either in config.json or environment variables. See' +
        ' README.md for more details.'
    }
});

var quiz = new gameState.Quiz();

function verifyHost(socket) {
    return Q.ninvoke(socket, 'get', 'hostAuthenticated')
    .then(function (authenticated) {
        var authResult = false;

        if (!authenticated) {
            authResult = config.get('hostSecret')
            .then(function (hostSecret) {
                var token = randomstring.generate(30);
                var hashed = Crypto.HMAC(Crypto.SHA256, token, hostSecret);

                return Q.ninvoke(socket, 'emit', 'host auth challenge', token)
                .then(function (response) {
                    if (response === hashed) {
                        socket.set('hostAuthenticated', 'true');
                        return true;
                    } else {
                        return false;
                    }
                });
            });
        } else {
            authResult = true;
        }

        return authResult;
    });
}

function bindPlayerDetailsReceived(socket) {
    // If this connection already has a player on it, update the player's details,
    // else save the new player to the db and associate it with this connection
    socket.on('player details', function (data, fn) {
        if (data.uuid) { // But data from a previous session
            quiz.modifyPlayer(data)
            .then(function (result) {
                if (result.success) {
                    fn({success: true, playerDetails: data});
                    socket.set('playerDetails', data);
                    socket.emit('player details updated', data);
                    socket.broadcast.emit('player details updated', data);
                    socket.emit('state updated', {state: quiz.getState()});
                } else {
                    fn({success: false, errors: result.errors});
                }
            })
            .done();
        } else { // Has never played before
            var uuid = UUID.create().toString();
            _.extend(data, {uuid: uuid});
            quiz.addPlayer(data)
            .then(function (result) {
                if (result.success) {
                    fn({success: true, playerDetails: data});
                    socket.set('playerDetails', data);
                    socket.emit('player details updated', data);
                    socket.broadcast.emit('player details updated', data);
                    socket.emit('state updated', {state: quiz.getState()});
                } else {
                    fn({success: false, errors: result.errors});
                }
            })
            .done();
        }
    });
}

function bindRequestTeamList(socket) {
    socket.on('request team list', function (fn) {
        quiz.getAllPlayers()
        .then(function (players) {
            fn({players: players});
        })
        .done();
    });
}

function bindUpdateState(socket) {
    socket.on('host update state', function (data) {
        verifyHost(socket)
        .then(function (authenticated) {
            if (authenticated) {
                quiz.updateState(data.state);
                socket.emit('state updated', data);
                socket.broadcast.emit('state updated', data);
            }
        })
        .done();
    });
}

function requestPlayerDetails(socket) {
    socket.emit('request player details');
}

function sendScores(socket) {
    quiz.getScores()
    .then(function (scores) {
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

            Q.ninvoke(socket, 'get', 'playerDetails')
            .then(function (data) {
                socket.broadcast.emit('player buzzed', data);
            })
            .done();

            fn({success: true});
        } else {
            fn({success: false});
        }
    });
}

function bindChangeScore(socket) {
    socket.on('host change score', function (data) {
        verifyHost(socket)
        .then(function (authenticated) {
            if (authenticated) {
                return quiz.changeScore(data)
                .then(function (scores) {
                    socket.emit('scores updated', scores);
                    socket.broadcast.emit('scores updated', scores);
                })
                .done();
            }
        });
    });
}

function bindKickPlayer(socket) {
    socket.on('host kick player', function (uuid) {
        verifyHost(socket)
        .then(function (authenticated) {
            if (authenticated) {
                quiz.removePlayer(uuid)
                .then(function () {
                    socket.emit('player disconnected', {uuid: uuid, kicked: true});
                    socket.broadcast.emit('player disconnected', {uuid: uuid, kicked: true});
                })
                .done();
            }
        })
        .done();
    });
}

function bindDisconnect(socket) {
    socket.on('disconnect', function () {
        Q.ninvoke(socket, 'get', 'playerDetails')
        .then(function (details) {
            if (details) {
                quiz.removePlayer(details.uuid)
                .then(function () {
                    socket.broadcast.emit('player disconnected', {uuid: details.uuid});
                })
                .done();
            }
        })
        .done();
    });
}

exports.init = function (socket) {
    bindPlayerDetailsReceived(socket);
    bindRequestTeamList(socket);
    bindUpdateState(socket);
    bindRequestState(socket);
    bindBuzz(socket);
    bindChangeScore(socket);
    // bindDisconnect(socket);
    bindKickPlayer(socket);

    requestPlayerDetails(socket);
    sendScores(socket);
};