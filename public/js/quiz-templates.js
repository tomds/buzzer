quizTemplates = {
    playerDetailsForm: Hogan.compile(
        '<form id="player-details-form">' +
            '<input name="name" placeholder="Your name" /><br />' +
            '<input type="radio" name="team" value="red" id="radio-team-red" /><label for="radio-team-red">Red</label>' +
            '<input type="radio" name="team" value="blue" id="radio-team-blue" /><label for="radio-team-blue">Blue</label>' +
            '<input type="radio" name="team" value="green" id="radio-team-green" /><label for="radio-team-green">Green</label>' +
            '<input type="radio" name="team" value="yellow" id="radio-team-yellow" /><label for="radio-team-yellow">Yellow</label><br />' +
            '<input type="submit" value="Update" />' +
        '</form>'
    ),

    welcomeMessage: Hogan.compile(
        '<div id="welcome-message">' +
            '<h1>Welcome, {{ name }}</h1>' +
            '<p>You are on the {{ team }} team.</p>' +
        '</div>'
    ),

    buzzerActive: Hogan.compile(
        '<div id="buzzer-active"><div id="btn-buzzer" class="btn {{ buttonClass }}">BUZZ!</div></div>'
    ),
};
