var Q = require('q');

var db = require('mongojs').connect('quiz', ['scores', 'players']);

function Quiz () {
    this.startQuiz();
}

Quiz.prototype = {
    gameState: 'starting',

    startQuiz: function() {
        // Continue previous quiz, or start new one if none found
        Q.ninvoke(db.scores, 'findOne', {})
        .done(function (scores) {
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

    addPlayer: function (details) {
        return Q.invoke(this, 'validatePlayer', details)
        .then(function (result) {
            if (result.success) {
                return Q.ninvoke(db.players,'insert', details)
                .then(function () {
                    return result;
                });
            } else {
                return result;
            }
        });        
    },

    modifyPlayer: function (details) {
        return Q.invoke(this, 'validatePlayer', details)
        .then(function (result) {
            if (result.success) {
                return Q.ninvoke(db.players, 'update', {uuid: details.uuid}, {$set: {name: details.name, team: details.team}}, {upsert: true})
                .then(function () {
                    return result;
                });
            } else {
                return result;
            }
        });
    },

    validatePlayer: function (details) {
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

        return Q.ninvoke(db.players, 'find', {
            team: details.team,
            name: details.name,
            uuid: {$ne: details.uuid}
        })
        .then(function (players) {
            if (players.length) {
                success = false;
                errors.name.push('Someone on your team already has that name - please choose another');
            }

            return {success: success, errors: errors};
        });
    },

    removePlayer: function (uuid) {
        return Q.ninvoke(db.players, 'remove', {uuid: uuid});
    },

    getAllPlayers: function () {
        return Q.ninvoke(db.players, 'find', {});
    },

    updateState: function (state) {
        this.gameState = state;
        return state;
    },

    getState: function () {
        return this.gameState;
    },

    getScores: function () {
        return Q.ninvoke(db.scores, 'findOne', {});
    },

    changeScore: function (data) {
        var incDec = data.direction === 'up' ? 1 : -1;
        var team = data.team
        var self = this;

        var updateSubObject = {};
        updateSubObject[team] = incDec;
        var updateObject = {$inc: updateSubObject};

        return Q.ninvoke(db.scores, 'update', {}, updateObject)
        .then(self.getScores);
    }
};

exports.Quiz = Quiz;