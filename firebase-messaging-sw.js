// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyBh20lCB3WQ7ajQTZKLswXPSPeGbVwslAw",
      authDomain: "autoforce-cam.firebaseapp.com",
      databaseURL: "https://autoforce-cam.firebaseio.com",
      projectId: "autoforce-cam",
      storageBucket: "autoforce-cam.appspot.com",
      messagingSenderId: "677986802871",
      appId: "1:677986802871:web:1416c35dec986f7f064132",
      measurementId: "G-PRS9B131D9"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

/*messaging.setBackgroundMessageHandler(function(payload) {
  //console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here

  //self.registration.hideNotification();

  //return null;

  if(payload.data ){
    if(payload.data.author){


      const notificationTitle = payload.data.author;

      const notificationOptions = {
        body: payload.data.twi_body,
        icon: '/assets/img/login_logo.png'
      };

      return self.registration.showNotification(notificationTitle,
        notificationOptions);
    } else {
      return null;
    }
  } else {
    return null;
  }
});*/

self.addEventListener('push', function(event) {

//console.log(event.data.text())
  var payload = event.data.json();

  if(payload.data ){
    if(payload.data.author){


      const notificationTitle = payload.data.author;

      const notificationOptions = {
        body: payload.data.twi_body,
        icon: '/assets/img/login_logo.png'
      };

      event.waitUntil( self.registration.showNotification(notificationTitle,
        notificationOptions));
    } else {
      event.waitUntil(null);
    }
  } else {
    event.waitUntil(null);
  }
});