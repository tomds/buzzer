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

    addPlayer: function (uuid, details) {
        var player = {
            uuid: uuid,
            name: details.name,
            team: details.team
        }

        db.players.insert(player);
    },

    modifyPlayer: function (uuid, details) {
        db.players.update({uuid: uuid}, {$set: {name: details.name, team: details.team}}, {upsert: true});
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