quizTemplates = {
    lobby: Hogan.compile(
        '<div id="btn-start-game" class="btn"></span class="btn">Start game</span></div>' +
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
    )
};
