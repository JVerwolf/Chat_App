const USRNAME_COOKIE_LIFE = 1; //The life of the cookie holding the username, in days.

//requires socket.io to be previously loaded in the DOM
//window.location.href is the JS variable holding the URL
var socket = io(window.location.href);

// handle username
var username = getCookie("Chat_Username"); //names the coookie
if (!username) {
    var tempUsername = "Derpy" + Math.floor((Math.random() * 1000) + 1);
    username = prompt("Please enter a user name!", tempUsername);
    setCookie('username', username, USRNAME_COOKIE_LIFE);
    socket.emit('newUser', {
        'user': username
    });
}

/**
 * Actions to be performed when user hit's 'send' button
 */
$('form').submit(function () {
    var $input = $('#m').val();
    var message = {
        name: username,
        text: $input
    };
    socket.emit('chat message', message);
    //clear the input dialog
    $('#m').val('');
    return false;
});

socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg.name + "  " + msg.text));
});

//==============Helper functions======================

/**
 * Gets cookies. Shoutout to W3S.
 * @param cname The name of the cookie
 * @returns {String} The value stored in the cookie
 */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return null;
}

/**
 * Sets cookies. Shoutout to W3S.
 * @param cname The name of the cookie
 * @param cvalue The value stored in the cookie
 * @param exdays The number of days for the cookie to last
 */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
