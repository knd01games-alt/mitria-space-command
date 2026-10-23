const firebaseConfig = {
  apiKey: "AIzaSyCHcJ728uZgRgkbPPcKrAmrLShX0kmJmiY",
  authDomain: "mitria-space-command.firebaseapp.com",
  projectId: "mitria-space-command",
  storageBucket: "mitria-space-command.appspot.com",
  messagingSenderId: "134317688881",
  appId: "1:134317688881:web:416a1121be8ce272b5ed10",
  measurementId: "G-03QZZERVH5"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
