var db = require('mongojs').connect('quiz', ['scores', 'players']);

function Quiz () {
    this.startQuiz();
}

Quiz.prototype = {
    gameState: 'starting',

    startQuiz: function() {
        // Continue previous quiz, or start new one if none found
        db.scores.findOne({}, function (err, scores) {
            if (!scores) {
                var scores = {
                    red: 0,
                    blue: 0,
                    green: 0,
                    yellow: 0
                };

                db.scores.insert(scores);
            }
        });
    },

    addPlayer: function (details, callback) {
        this.validatePlayer(details, function (err, result) {
            if (result.success) {
                db.players.insert(details, function () {
                    callback(null, result);
                });
            } else {
                callback(null, result);
            }
        });        
    },

    modifyPlayer: function (details, callback) {
        this.validatePlayer(details, function (err, result) {
            if (result.success) {
                db.players.update({uuid: details.uuid}, {$set: {name: details.name, team: details.team}}, {upsert: true}, function () {
                    callback(null, result);
                });
            } else {
                callback(null, result);
            }
        });
    },

    validatePlayer: function (details, callback) {
        var errors = {
            name: [],
            team: []
        };
        var validTeams = ['red', 'blue', 'green', 'yellow'];
        var success = true;

        if (validTeams.indexOf(details.team) === -1) {
            errors.team.push('Please choose a valid team');
            success = false;
        }

        if (!details.name) {
            errors.name.push('Name is a mandatory field');
            success = false;
        }

        db.players.find({
            team: details.team,
            name: details.name,
            uuid: {$ne: details.uuid}
        }, function (err, players) {
            if (players.length) {
                success = false;
                errors.name.push('Someone on your team already has that name - please choose another');
            }

            callback (null, {success: success, errors: errors});
        });
    },

    removePlayer: function (uuid, callback) {
        db.players.remove({uuid: uuid}, function () {
            callback();
        });
    },

    getAllPlayers: function (callback) {
        db.players.find({}, function (err, players) {
            callback(players);
        });
    },

    updateState: function (state) {
        this.gameState = state;
        return state;
    },

    getState: function () {
        return this.gameState;
    },

    getScores: function (callback) {
        db.scores.findOne({}, function (err, scores) {
            callback(null, scores);
        });
    },

    changeScore: function (data, callback) {
        var incDec = data.direction === 'up' ? 1 : -1;
        var team = data.team
        var self = this;

        var updateSubObject = {};
        updateSubObject[team] = incDec;
        var updateObject = {$inc: updateSubObject};

        db.scores.update({}, updateObject, function (err) {
            self.getScores(function (err, scores) {
                callback(null, scores);
            });
        });
    }
};

exports.Quiz = Quiz;