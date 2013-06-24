quizTemplates = {
    validationErrors: Hogan.compile(
        '<ul>' +
            '{{# name }}<li>{{ . }}</li>{{/ name }}' +
            '{{# team }}<li>{{ . }}</li>{{/ team }}' +
        '</ul>'
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

    buzzSuccess: Hogan.compile(
        '<p id="buzz-outcome">You buzzed first!</p>'
    ),

    buzzFail: Hogan.compile(
        '<p id="buzz-outcome">Too slow...</p>'
    ),

    playerDetails: Hogan.compile(
        '<span class="player-name">{{ name }}</span>, ' +
        '<span class="player-team">{{ team }}</span> team ' +
        '<span id="edit-details-button" class="btn">Change</span>'
    )
};
