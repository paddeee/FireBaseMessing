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

(function() {

    var myDataRef = new Firebase('https://incandescent-heat-3687.firebaseio.com/');

    document.querySelector('#messageInput').onkeypress = function (target) {
        if (target.keyCode === 13) {
            var name = document.querySelector('#nameInput').value;
            var text = document.querySelector('#messageInput').value;
            myDataRef.set('User ' + name + ' says ' + text);
            document.querySelector('#messageInput').value = '';
        }
    };
})();