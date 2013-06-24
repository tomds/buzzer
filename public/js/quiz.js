var socket = io.connect();
var gameState = '';
var buzzerSound;

function showPlayerDetailsForm(errors) {
    $('#quiz-container').html('');

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
        $('#quiz-container').html(quizTemplates.welcomeMessage.render(store.get('player')));
    }
}

function setBuzzerSound(playerDetails) {
    var team = playerDetails.team;
    buzzerSound = new Howl({
        urls: ['audio/buzzer_' + team + '.mp3']
    });
}

function validatePlayer(playerDetails) {
    $('#player-details-form .errors').html('');

    socket.emit('player details', playerDetails, function (data) {
        if (data.success) {
            store.set('player', data.playerDetails);
            setBuzzerSound(data.playerDetails);
            $('#quiz-container').html('');
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
            newClass = 'btn-primary';
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
    // Don't show the button until this player is actually in the game.
    // If they are still entering details, don't do anything.
    if (!$('#player-details-form').length && !$('#buzzer-active').length) {
        var buttonClass = getButtonClass(store.get('player').team);
        $('#quiz-container').html(quizTemplates.buzzerActive.render({buttonClass: buttonClass}));
    }
}

function buzzersActive() {
    showGame();
    $('#buzz-outcome').remove();
}

function onSubmitPlayerDetails(e) {
    e.preventDefault();
    var $form = $('#player-details-form');

    var playerDetails = {
        name: $form.find('[name=name]').val(),
        team: $form.find('[name=team]:checked()').val()
    };

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

function bindSockets() {
    socket.on('request player details', getPlayerDetails);
    socket.on('state updated', onStateUpdated);
    socket.on('scores updated', onScoresUpdated);
}

function bindDom() {
    var $submitButton = $('#modal-player-details .btn-primary').hammer();
    $submitButton.on('tap', onSubmitPlayerDetails);
    $('#player-details-form').on('submit', onSubmitPlayerDetails);
    $submitButton.on('click', function (e) { e.preventDefault(); });

    var $container = $('#quiz-container').hammer();
    $container.on('tap', '#btn-buzzer', onBuzz);
}

function init() {
    bindDom();
    bindSockets();
}

init();