var socket = io.connect();

function showUserDetailsForm(errors) {
    $('#quiz-container').html(quizTemplates.userDetailsForm.render());
}

function showWelcomeMessage() {
    $('#quiz-container').html(quizTemplates.welcomeMessage.render(store.get('user')));
}

function validateUser(userDetails) {
    socket.emit('user details', userDetails, function (data) {
        if (data.success) {
            store.set('user', data.userDetails);
            showWelcomeMessage();
        } else {
            showUserDetailsForm(data.errors);
        }
    });
}

function getUserDetails() {
    var userDetails = store.get('user');
    if (userDetails) {
        validateUser(userDetails);
    } else {
        showUserDetailsForm();
    }
}

function onSubmitUserDetails(e) {
    e.preventDefault();
    var $this = $(this);

    var userDetails = {
        name: $this.find('[name=name]').val(),
        team: $this.find('[name=team]:checked()').val()
    };

    validateUser(userDetails);
}

function bindSockets() {
    socket.on('request user details', function () {
        getUserDetails();
    });
}

function bindDom() {
    $('#quiz-container').on('submit', '#user-details-form', onSubmitUserDetails);
}

function init() {
    bindDom();
    bindSockets();
}

init();