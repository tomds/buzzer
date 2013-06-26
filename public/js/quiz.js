var socket = io.connect();
var gameState = '';
var buzzerSound;

function showPlayerDetailsForm(errors) {
    var $form = $('#player-details-form');
    if (errors && !errors.success) {
        $form.find('.errors').html(quizTemplates.validationErrors.render(errors.errors));
    }

    var $nameField = $form.find('[name=name]');
    var $selectedTeam = $('#player-details-form [name=team]:checked').val();
    var player = store.get('player')
    if (!$nameField.val() && player) {
        var name = player.name;
        if (name) {
            $nameField.val(name);
        }
    }

    if (!$selectedTeam && player) {
        var team = player.team;
        if (team) {
            $form.find('[name=team][value=' + team + ']').prop('checked', true);
        }
    }

    $('#modal-player-details').modal('show');
}

function showWelcomeMessage() {
    if (!$('#welcome-message').length) {
        $('#quiz-container').html(quizTemplates.welcomeMessage.render());
    }
    getFullTeamsUpdate();
}

function setBuzzerSound(playerDetails) {
    var team = playerDetails.team;
    buzzerSound = new Howl({
        urls: ['audio/buzzer_' + team + '.mp3', 'audio/buzzer_' + team + '.ogg']
    });
}

function validatePlayer(playerDetails) {
    $('#player-details-form .errors').html('');

    socket.emit('player details', playerDetails, function (data) {
        if (data.success) {
            store.set('player', data.playerDetails);
            setBuzzerSound(data.playerDetails);
            $('#player-details').html(quizTemplates.playerDetails.render(data.playerDetails));
            $('#modal-player-details').modal('hide');
        } else {
            showPlayerDetailsForm(data);
        }
    });
}

function getPlayerDetails() {
    var playerDetails = store.get('player');
    if (playerDetails) {
        validatePlayer(playerDetails);
    } else {
        showPlayerDetailsForm();
    }
}

function getButtonClass(team) {
    var newClass = '';

    switch (team) {
        case 'red':
            newClass = 'btn-danger';
            break;
        case 'blue':
            newClass = 'btn-info';
            break;
        case 'green':
            newClass = 'btn-success';
            break;
        case 'yellow':
            newClass = 'btn-warning';
            break;
    }

    return newClass;
}

function showGame() {
    var player = store.get('player');
    if (player) {
        $('#quiz-container').html(quizTemplates.buzzerActive.render());
    }
}

function buzzersActive() {
    showGame();
    $('#buzz-outcome').remove();

    var player = store.get('player');
    var buttonClass = getButtonClass(player.team);
    $('#btn-buzzer').removeClass('disabled').addClass(buttonClass);
}

function onSubmitPlayerDetails(e) {
    e.preventDefault();
    var $form = $('#player-details-form');

    var playerDetails = {
        name: $form.find('[name=name]').val(),
        team: $form.find('[name=team]:checked()').val()
    };

    var storedPlayer = store.get('player');
    if (storedPlayer) {
        playerDetails.uuid = storedPlayer.uuid;
    }

    validatePlayer(playerDetails);
}

function onStateUpdated(data) {
    gameState = data.state;

    switch (data.state) {
        case 'buzzersActive':
            buzzersActive();
            break;
        case 'buzzersInactive':
            showGame();
            break;
        case 'starting':
            showWelcomeMessage();
            break;
    }
}

function onScoresUpdated(data) {
    for (team in data) {
        $('.score.' + team + ' .value').text(data[team]);
    }
}

function onBuzz(e) {
    buzzerSound.stop().play();

    if (gameState === 'buzzersActive') {
        socket.emit('buzz', function (data) {
            // See if server says that we buzzed first and render accordingly
            if (!$('#buzz-outcome').length) {
                if (data.success) {
                    $('#btn-buzzer').after(quizTemplates.buzzSuccess.render());
                } else {
                    $('#btn-buzzer').after(quizTemplates.buzzFail.render());
                }
            }
        });
    } else if (gameState === 'buzzersInactive') {
        if (!$('#buzz-outcome').length) {
            $('#btn-buzzer').after(quizTemplates.buzzFail.render());
        }
    }
}

function updateTeamNumbers() {
    $('.team-list-full').each(function () {
        var $this = $(this);
        var numPlayers = $this.find('li').length;
        $this.find('.num-players').text(numPlayers);
    });
}

function updateTeamLists(data) {
    var player = store.get('player');
    var you = false;
    if (player && player.uuid === data.uuid) {
        you = true;
    }
    data.you = you;

    var $teams = $('#teams');
    $teams.find('li[data-uuid=' + data.uuid + ']').remove();
    var $team = $teams.find('.team-list-full.' + data.team);
    $team.find('ul').prepend(quizTemplates.playerEntry.render(data));
}

function getFullTeamsUpdate() {
    socket.emit('request team list', function (data) {
        $.each(data.players, function () {
            updateTeamLists(this);
        });

        updateTeamNumbers();
    });
}

function onPlayerDisconnected(details) {
    var player = store.get('player');

    // If the player who has disconnected is me, I have been kicked
    if (player && player.uuid === details.uuid && details.kicked) {
        store.clear();
        window.location.reload();
    } else {
        var $teams = $('#teams');
        $teams.find('li[data-uuid=' + details.uuid + ']').remove();
        updateTeamNumbers();
    }
}

function bindSockets() {
    socket.on('request player details', function () {
        getFullTeamsUpdate();
        getPlayerDetails();
    });
    socket.on('state updated', onStateUpdated);
    socket.on('scores updated', onScoresUpdated);
    socket.on('player disconnected', onPlayerDisconnected);

    socket.on('player details updated', function (data) {
        updateTeamLists(data);
        updateTeamNumbers();
    });
}

function bindDom() {
    var $submitButton = $('#modal-player-details .btn-primary').hammer();
    $submitButton.on('click', onSubmitPlayerDetails);
    $('#player-details-form').on('submit', onSubmitPlayerDetails);
    $submitButton.on('click', function (e) { e.preventDefault(); });

    var $container = $('#quiz-container').hammer();
    $container.on('tap', '#btn-buzzer', onBuzz);
    $('.masthead').hammer().on('tap', '#edit-details-button', function (e) {
        showPlayerDetailsForm();
    });
}

function init() {
    bindDom();
    bindSockets();

    showWelcomeMessage();
}

init();