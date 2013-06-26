quizTemplates = {
    lobby: Hogan.compile(
        '<div id="btn-start-game" class="btn">' +
        '</span class="btn">Start game</span></div> ' +
        '<div id="btn-init-sounds" class="btn">Init sounds</div> ' +
        '<div id="btn-change-password" class="btn">Change password</div>' +
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
        '</div>'
    ),

    playerEntry: Hogan.compile(
        '<li data-uuid="{{ uuid }}">{{ name }} &nbsp;<span class="kick-player btn">Kick</span></li>'
    ),

    listenBuzzers: Hogan.compile(
        '<p>Waiting for buzzer...</p>' +
        '<div id="btn-reset-buzzers" class="btn">Reset</div>'
    ),

    playerBuzzed: Hogan.compile(
        '<div id="player-buzzed">' +
            '<p>BUZZED: <strong class="{{ team }}">{{ name }}</strong></p>' +
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
