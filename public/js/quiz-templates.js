quizTemplates = {
    validationErrors: Hogan.compile(
        '<ul>' +
            '{{# name }}<li>{{ . }}</li>{{/ name }}' +
            '{{# team }}<li>{{ . }}</li>{{/ team }}' +
        '</ul>'
    ),

    buzzerActive: Hogan.compile(
        '<div id="buzzer-active"><div id="btn-buzzer" class="btn btn-large btn-block {{ buttonClass }}">BUZZ!</div></div>'
    ),

    buzzSuccess: Hogan.compile(
        '<p id="buzz-outcome">You buzzed first!</p>'
    ),

    buzzFail: Hogan.compile(
        '<p id="buzz-outcome">Too slow...</p>'
    ),

    playerDetails: Hogan.compile(
        '<strong><span class="player-name">{{ name }}</span>, ' +
        '<span class="player-team {{ team }}">{{ team }} team</span></strong> ' +
        '<span id="edit-details-button" class="btn">Change</span>'
    ),

    welcomeMessage: Hogan.compile (
        '<div id="welcome-message">' +
            '<div id="teams">'+
                '<div class="team-list-full red">' +
                    '<h3>Red team: <span class="num-players">0</span> players</h3>' +
                    '<ul></ul>' +
                '</div>' +

                '<div class="team-list-full blue">' +
                    '<h3>Blue team: <span class="num-players">0</span> players</h3>' +
                    '<ul></ul>' +
                '</div>' +

                '<div class="team-list-full green">' +
                    '<h3>Green team: <span class="num-players">0</span> players</h3>' +
                    '<ul></ul>' +
                '</div>' +

                '<div class="team-list-full yellow">' +
                    '<h3>Yellow team: <span class="num-players">0</span> players</h3>' +
                    '<ul></ul>' +
                '</div>' +
            '</div>' +
        '</div>'
    ),

    playerEntry: Hogan.compile(
        '<li data-uuid="{{ uuid }}" {{# you }}class="you"{{/ you }}>{{# you }}You! -&gt; {{/ you }}{{ name }}</li>'
    ),
};
