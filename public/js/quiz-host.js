var socket = io.connect();

function getFullTeamsUpdate() {
    socket.emit('host request team list', function (data) {
        $.each(data.players, function () {
            updateTeamLists(this);
        });

        updateTeamNumbers();
    });
}

function showWelcomeMessage() {
    $('#quiz-container').html(quizTemplates.lobby.render());
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

function listenBuzzers() {
    if (!$('#game-in-progress').length) {
        $('#quiz-container').html(quizTemplates.listenBuzzers.render());
    }
}

function onStateUpdated(data) {
    switch (data.state) {
        case 'buzzersActive':
            listenBuzzers();
            break;
        case 'starting':
            showWelcomeMessage();
            break;
    }
}

function activateBuzzers() {
    socket.emit('host update state', {state: 'buzzersActive'});
}

function getState () {
    socket.emit('request state');
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

    socket.on('state updated', onStateUpdated);
}

function bindDom() {
    var $container = $('#quiz-container').hammer();

    $container.on('tap', '#btn-start-game', activateBuzzers);
}

function init() {
    bindDom();
    bindSockets();
}

init();