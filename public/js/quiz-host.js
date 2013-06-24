var socket = io.connect();
var sounds = {};

function getFullTeamsUpdate() {
    socket.emit('host request team list', function (data) {
        $.each(data.players, function () {
            updateTeamLists(this);
        });

        updateTeamNumbers();
    });
}

function showWelcomeMessage() {
    $('#btn-reset-buzzers').hide();
    $('#btn-start-game').show();
    getFullTeamsUpdate();
}

function updateTeamNumbers() {
    $('.team-list-full').each(function () {
        var $this = $(this);
        var numPlayers = $this.find('li').length;
        $this.find('.num-players').text(numPlayers);
    });
}

function updateTeamLists(data) {
    var $teams = $('#teams');
    $teams.find('li[data-uuid=' + data.uuid + ']').remove();
    var $team = $teams.find('.team-list-full.' + data.team);
    $team.find('ul').prepend(quizTemplates.playerEntry.render(data));
}

function onPlayerDisconnected (data) {
    var $teams = $('#teams');
    $teams.find('li[data-uuid=' + data.uuid + ']').remove();
    updateTeamNumbers();
}

function listenBuzzers() {
    if (!$('#game-in-progress').length) {
        $('#quiz-container').html(quizTemplates.listenBuzzers.render());
        $('#btn-reset-buzzers').show();
        $('#btn-start-game').hide();
    }
}

function buzzersInactive() {
    if (!$('#player-buzzed').length) {
        $('#quiz-container').html(quizTemplates.buzzersInactive.render());
        $('#btn-reset-buzzers').show();
        $('#btn-start-game').hide();
    }
}

function onStateUpdated(data) {
    switch (data.state) {
        case 'buzzersActive':
            listenBuzzers();
            break;
        case 'buzzersInactive':
            buzzersInactive();
            break;
        case 'starting':
            showWelcomeMessage();
            break;
    }
}

function playSound(team) {
    sounds[team].play();
}

function onPlayerBuzz(data) {
    playSound(data.team);
    $('#quiz-container').html(quizTemplates.playerBuzzed.render(data));
}

function activateBuzzers() {
    socket.emit('host update state', {state: 'buzzersActive'});
}

function getState () {
    socket.emit('request state');
}

function initSounds() {
    sounds = {
        red: new Howl({urls: ['audio/buzzer_red.mp3']}),
        blue: new Howl({urls: ['audio/buzzer_blue.mp3']}),
        green: new Howl({urls: ['audio/buzzer_green.mp3']}),
        yellow: new Howl({urls: ['audio/buzzer_yellow.mp3']})
    };

    sounds.red.play();
    sounds.blue.play();
    sounds.green.play();
    sounds.yellow.play();
}

function onScoresUpdated(data) {
    for (team in data) {
        $('.score.' + team + ' .value').text(data[team]);
    }
}

function showHostControls() {
    $('.score .value').after(quizTemplates.hostScoreEdit.render());
    $('#lobby-container').html(quizTemplates.lobby.render());
}

function changeScore(e) {
    var $this = $(this);
    var team = $this.closest('.score').data('team');
    var direction = $this.data('direction');
    socket.emit('host change score', {team: team, direction: direction});
}

function bindSockets() {
    socket.on('request player details', function () {
        // This signifies that the connection has been established. Pay no attention
        // to the message name, it's completely unrelated to its purpose! Makes more
        // sense if you're a normal player, honest ;)

        getState();
    });

    socket.on('player details updated', function (data) {
        updateTeamLists(data);
        updateTeamNumbers();
    });

    socket.on('player disconnected', onPlayerDisconnected);

    socket.on('state updated', onStateUpdated);
    socket.on('scores updated', onScoresUpdated);

    socket.on('player buzzed', onPlayerBuzz);
}

function bindDom() {
    $('#quiz-container').hammer().on('tap', '#btn-reset-buzzers', activateBuzzers);
    $('#lobby-container').hammer().on('tap', '#btn-start-game', activateBuzzers);
    $('#lobby-container').hammer().on('tap', '#btn-init-sounds', initSounds);
    $('#scores').hammer().on('tap', '.host-score-edit span[data-direction]', changeScore);
}

function init() {
    bindDom();
    bindSockets();
    showHostControls();
}

init();