var socket = io.connect();
var gameState = '';

function showPlayerDetailsForm(errors) {
    $('#quiz-container').html(quizTemplates.playerDetailsForm.render());
}

function showWelcomeMessage() {
    if (!$('#welcome-message').length) {
        $('#quiz-container').html(quizTemplates.welcomeMessage.render(store.get('player')));
    }
}

function validatePlayer(playerDetails) {
    socket.emit('player details', playerDetails, function (data) {
        if (data.success) {
            store.set('player', data.playerDetails);
            $('#quiz-container').html('');
        } else {
            showPlayerDetailsForm(data.errors);
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
    var $this = $(this);

    var playerDetails = {
        name: $this.find('[name=name]').val(),
        team: $this.find('[name=team]:checked()').val()
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

function onBuzz(e) {
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
}

function bindDom() {
    var $container = $('#quiz-container').hammer();
    $container.on('submit', '#player-details-form', onSubmitPlayerDetails);
    $container.on('tap', '#btn-buzzer', onBuzz);
}

function init() {
    bindDom();
    bindSockets();
}

init();