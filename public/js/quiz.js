var socket = io.connect();

function showPlayerDetailsForm(errors) {
    $('#quiz-container').html(quizTemplates.playerDetailsForm.render());
}

function showWelcomeMessage() {
    $('#quiz-container').html(quizTemplates.welcomeMessage.render(store.get('player')));
}

function validatePlayer(playerDetails) {
    socket.emit('player details', playerDetails, function (data) {
        if (data.success) {
            store.set('player', data.playerDetails);
            showWelcomeMessage();
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

function onSubmitPlayerDetails(e) {
    e.preventDefault();
    var $this = $(this);

    var playerDetails = {
        name: $this.find('[name=name]').val(),
        team: $this.find('[name=team]:checked()').val()
    };

    validatePlayer(playerDetails);
}

function bindSockets() {
    socket.on('request player details', function () {
        getPlayerDetails();
    });
}

function bindDom() {
    $('#quiz-container').on('submit', '#player-details-form', onSubmitPlayerDetails);
}

function init() {
    bindDom();
    bindSockets();
}

init();