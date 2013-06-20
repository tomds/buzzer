var socket = io.connect();

function showWelcomeMessage() {
    $('#quiz-container').html(quizTemplates.lobby.render());
}

function updateTeamNumbers() {
    $('.team-list-full').each(function () {
        var $this = $(this);
        var numPlayers = $this.find('li').length();
        $this.find('.num-players').text(numPlayers);
    });
}

function updateTeamLists(data) {
    var $teams = $('#teams');
    $teams.find('li[data-uuid=' + data.uuid + ']').remove();
    var $team = $teams.find('.team-list-full.' + data.team);
    $team.find('ul').prepend(quizTemplates.playerEntry.render(data));
}

function bindSockets() {
    socket.on('player details updated', function (data) {
        updateTeamLists(data);
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