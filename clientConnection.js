function bindUserDetailsReceived (socket) {
    socket.on('user details', function (data, fn) {
        fn({success: true, userDetails: data});
    });
}

function requestUserDetails(socket) {
    socket.emit('request user details');
}

function sendInitialState(socket) {

}

exports.init = function (socket) {
    bindUserDetailsReceived(socket);

    requestUserDetails(socket);
};