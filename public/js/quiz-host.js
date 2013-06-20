var socket = io.connect();

function showWelcomeMessage() {
    $('#quiz-container').html(quizTemplates.lobby.render());
}

function bindSockets() {
    socket.on('request user details', function () {

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