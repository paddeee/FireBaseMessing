/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

(function () {

    var $txtEmail = $('#txtEmail');
    var $txtPass = $('#txtPass');
    var $chkRegister = $('#chkRegister');
    var $btAction = $('#btAction');
    var $btLogout = $('#btLogout');
    var $userList = $('#userList');
    var $error = $('#error');
    var $views = $('.view');
    var ref = new Firebase('https://incandescent-heat-3687.firebaseio.com/');
    var auth;
    var uid;

    // intialize Firebase Simple Login
    function initAuth(ref) {
        return new FirebaseSimpleLogin(ref, function (err, user) {
            // if there is an error then display it
            if (err) {
                displayError(err);
            } else if (user) {
                // we only want to log people in through the email/password provider
                if (user.provider !== 'password') {
                    auth.logout();
                }
                else {
                    // logged in!
                    uid = user.uid;
                    // save the user to our firebase
                    ref.child(user.uid).set({
                        id: user.id,
                        uid: user.uid,
                        email: user.email
                    });
                    // switch over the the user info screen
                    switchView('userInfo');
                }
            } else {
                // logged out!
                console.log('not logged in');
            }
        });
    }

    // custom event that fires off when we transition to the
    // userInfo page
    $('#userInfo').on('viewLoaded', function () {
        bindUsers();
    });

    // custom event that fires off when we transition to the
    // login page
    $('#login').on('viewLoaded', function () {
        // clear users
        $userList.html('');
        return;
    });

    function login() {
        auth.login('password', {
            email: $txtEmail.val(),
            password: $txtPass.val()
        });
    }

    function register() {
        auth.createUser($txtEmail.val(), $txtPass.val(), function (error, user) {
            // if there isn't an error, log the user in
            // then switch to the userInfo view
            if (!error) {
                login();
                switchView('userInfo');
            } else {
                // display any errors
                displayError(error);
            }
        });
    }

    // after logging out switch back to the login view
    function logout() {
        auth.logout();
        switchView('login');
    }

    // hides all views first, then shows the view that was
    // passed through the function
    function switchView(view) {
        var $view = $('#' + view);
        $views.removeClass('active');
        $view.addClass('active');
        $error.text(''); // clear error
        $view.trigger('viewLoaded');
    }

    // compares against error codes to display errors
    function displayError(error) {
        var errorMsg = '';
        switch (error.code) {
            case 'INVALID_EMAIL':
                errorMsg = 'You entered an invalid email';
                break;
            case 'INVALID_PASSWORD':
                errorMsg = 'You entered an invalid password';
                break;
            case 'EMAIL_TAKEN':
                errorMsg = 'The email you entered has been taken.';
                break;
            default:
                errorMsg = 'We\'re not really sure what happened.';
                break;
        }
        $error.text(errorMsg);
    }

    // attaches a child_added listener to firebase and whenever
    // a new child is added a list item gets appended
    function bindUsers() {
        ref.on('child_added', function (snap) {
            console.log(snap.val());
            $userList.append('<li>' + snap.val().email + '</li>');
        });
    }

    // toggles whether the user is registering and logging in
    $chkRegister.on('click', function () {
        $btAction.off('click');
        if ($chkRegister.is(':checked')) {
            $btAction.on('click', register);
            $btAction.text('Register');
        } else {
            $btAction.on('click', login);
            $btAction.text('Login');
        }
    });

    // default to register
    $btAction.on('click', register);

    // logout handler
    $btLogout.on('click', logout);

    auth = initAuth(ref);
})();