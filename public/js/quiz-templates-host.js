quizTemplates = {
    lobby: Hogan.compile(
        '<div id="btn-start-game" class="btn">' +
        '</span class="btn">Start game</span></div> ' +
        '<div id="btn-init-sounds" class="btn">Init sounds</div> ' +
        '<div id="btn-change-password" class="btn">Change password</div>' +
        '<div id="teams">'+
            '<div class="team-list-full red">' +
                '<h2>Red team: <span class="num-players">0</span> players</h2>' +
                '<ul></ul>' +
            '</div>' +

            '<div class="team-list-full blue">' +
                '<h2>Blue team: <span class="num-players">0</span> players</h2>' +
                '<ul></ul>' +
            '</div>' +

            '<div class="team-list-full green">' +
                '<h2>Green team: <span class="num-players">0</span> players</h2>' +
                '<ul></ul>' +
            '</div>' +

            '<div class="team-list-full yellow">' +
                '<h2>Yellow team: <span class="num-players">0</span> players</h2>' +
                '<ul></ul>' +
            '</div>' +
        '</div>'
    ),

    playerEntry: Hogan.compile(
        '<li data-uuid="{{ uuid }}">{{ name }}</li>'
    ),

    listenBuzzers: Hogan.compile(
        '<p>Waiting for buzzer...</p>' +
        '<div id="btn-reset-buzzers" class="btn">Reset</div>'
    ),

    playerBuzzed: Hogan.compile(
        '<div id="player-buzzed">' +
            '<p>BUZZ!</p>' +
            '<p>Player: <strong>{{ name }}</strong></p>' +
            '<p>Team: <strong>{{ team }}</strong></p>' +
            '<div id="btn-reset-buzzers" class="btn">Reset</div>' +
        '</div>'
    ),

    buzzersInactive: Hogan.compile(
        '<p>Buzzers inactive</p>' +
        '<div id="btn-reset-buzzers" class="btn">Reset</div>'
    ),

    hostScoreEdit: Hogan.compile(
        '<div class="host-score-edit">' +
            '<div class="btn" data-direction="up">+</div>' +
            '<div class="btn" data-direction="down">-</div>' +
        '</div>'
    )
};
