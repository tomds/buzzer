Buzzer
======

Webapp for hosting a quiz with up to 4 teams. Contestants use their phones as buzzers for answering questions, and the quiz host can see who buzzed first. Each team's buzzer makes a different sound. The scoreboard can be seen at the top of the screen, and the host can change each team's score at will.

Prerequesites
-------------

 * [Node.js](http://nodejs.org/)
 * [MongoDB server](http://www.mongodb.org/)

Installation
------------

    npm install

Initial config
--------------

Before you go any further, set up a secret passphrase for the quiz host, so nobody else can change the scores, kick players etc. You can do this by either setting an environment variable called `hostSecret` or creating a file called `config.json` as follows:

```javascript
{
    "hostSecret": "yourPassphrase"
}
```

How to use
----------

Start up the server:

    npm start

By default the server listens on port 3000. You can change this by setting the `PORT` environment variable.

 * Contestant URL: http://your.server:3000 (smartphone recommended)
 * Host URL: http://your.server:3000/host (iPad/Android tablet recommended)

When you load the host URL, you will be asked for a passphrase. Enter the one you put in your config (see above).

**Quiz host:** Once you're ready to start the quiz, tap the "Start game" button and then ask your first question. When a buzzer is pressed, you will see the name and team of the person who buzzed first, and can ask them for their answer, then add/subtract points as appropriate. Contestants' buzzers will only then be reactivated once you tap the "Reset" button.

**Note:** When a player buzzes, the host's phone/tablet will try to play the sound of the team who buzzed, but it probably won't work until you've pressed the "Init sounds" button at least once. This hack is needed because by default, most mobile devices won't play a sound unless it's a direct result of a user interaction. Obviously you might not want your host device to play the sounds, in which case ignore this bit :)

Browser support
---------------

Tested in:

 * Chrome 28 (desktop and mobile)
 * Firefox 22
 * Safari (iOS 6)
 * Android browser (Android 4.1)
