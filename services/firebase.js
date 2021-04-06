import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDCXLT3OhYO1gMndDKAoPWAtRFY1DWZWTM",
    authDomain: "nudge-299511.firebaseapp.com",
    databaseURL: "https://nudge-299511-default-rtdb.firebaseio.com",
    projectId: "nudge-299511",
    storageBucket: "nudge-299511.appspot.com",
    messagingSenderId: "637558220392",
    appId: "1:637558220392:web:13585a0c9d91e2c275fddd",
    measurementId: "G-8L8B0HYB86"
};

export default function initFirebase() => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}