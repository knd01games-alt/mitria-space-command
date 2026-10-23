const firebaseConfig = {
  apiKey: "AIzaSyCHcJ728uZgRgbPPcKrAmrLShX0kmJmiY",
  authDomain: "mitria-space-command.firebaseapp.com",
  projectId: "mitria-space-command",
  storageBucket: "mitria-space-command.appstorage.app",
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
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

function loginWithGoogle() {
  auth.signInWithPopup(googleProvider)
    .then((result) => {
      const user = result.user;
      return db.collection('users').doc(user.uid).get().then((doc) => {
        if (!doc.exists) {
          return db.collection('users').doc(user.uid).set({
            username: user.displayName || 'Comandante',
            email: user.email,
            photoURL: user.photoURL || '',
            mthBalance: 0.00,
            totalPower: 0,
            minersPower: 0,
            gamesPower: 0,
            temporaryPower: 0,
            gamesPlayed: 0,
            gamesWon: 0,
            createdAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
          });
        }
      });
    })
    .then(() => {
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error("Erro Auth Google:", error);
      alert("Erro ao conectar com o Google: " + error.message);
    });
}
