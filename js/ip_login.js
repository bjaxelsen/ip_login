/**
 * Client site funcitonality for IP login
 *
 * To minimise server load and avoid multiple login requests for same user, we
 * defer the IP login process to the client
 *
 * We want this to run as fast as possible, hence we use pure JS and do not wait for document to be ready,
 */

function ipLoginReadCookie(name) {
  'use strict';
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {c = c.substring(1, c.length);}
    if (c.indexOf(nameEQ) == 0) {return c.substring(nameEQ.length, c.length);}
  }
  return -1;
}

document.addEventListener('DOMContentLoaded', function (event) {
  'use strict';

  var ipLoginCookie = ipLoginReadCookie('ipLogin');
  var ipLoginNow = new Date().getTime();

  if (
    ipLoginCookie != 1 && // If not already logged in
        navigator.cookieEnabled && // and cookies must be enabled
        (ipLoginCookie == -1 || ipLoginCookie < (ipLoginNow - 10000)) // if not tried to log in or more than 10 seconds ago
  ) {
    // Set cookie with timestamp to avoid any more requests for ipLoginNow
    document.cookie = 'ipLogin=' + ipLoginNow + ';path=/';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', ipLogin.query, true);
    xhr.withCredentials = true;
    xhr.onload = function (e) {
      'use strict';
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (xhr.responseText == '1') {
          document.cookie = 'ipLogin=1;path=/';
          window.location.href = ipLogin.dologin;
        }
      }
    };
    xhr.send();
  }
});
