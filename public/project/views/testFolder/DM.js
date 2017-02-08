/**
 * Created by roopghosh on 12/6/16.
 */
(function () {

    DM.init({
        apiKey: 'c3e957395696bed5edfa',
        status: true, // check login status
        cookie: true // enable cookies to allow the server to access the session
    });
    var handleAPIResponse = function (response) {
        alert('Name is ' + response.screenname);
    };
})();