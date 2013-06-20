var socket = io.connect();

function showWelcomeMessage() {
    $('#quiz-container').html(quizTemplates.lobby.render());
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

function getFullTeamsUpdate() {
    socket.emit('host request team list', function (data) {
        $.each(data.players, function () {
            updateTeamLists(this);
        });

        updateTeamNumbers();
    });
}

function bindSockets() {
    socket.on('request player details', function () {
        // This signifies that the connection has been established. Pay no attention
        // to the message name, it's completely unrelated to its purpose! Makes more
        // sense if you're a normal player, honest ;)

        getFullTeamsUpdate();
    });

    socket.on('player details updated', function (data) {
        updateTeamLists(data);
        updateTeamNumbers();
    });
}

function bindDom() {
    // $('#quiz-container').on('submit', '#user-details-form', onSubmitUserDetails);
}

function init() {
    bindDom();
    bindSockets();

    showWelcomeMessage();
}

init();