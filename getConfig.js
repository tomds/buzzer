// Get instance-specific settings from env vars, falling back to config.json file if present

var nconf = require('nconf');
var Q = require('q');

// Set up config sources (env vars and config.json file)
nconf.env()
.file({
    file: 'config.json'
});

function get(setting) {
    return Q.fcall(function () {
        // Check if the setting is in env vars or has already been loaded from
        // disk, and if so, return it. If not, try loading from disk.

        var value = nconf.get(setting);

        if (value === undefined) {
            value = Q.ninvoke(nconf, 'load')
            .then(function () {
                return nconf.get(setting);
            });
        }

        return value;
    });
}

exports.get = get;