// Configuração limpa do Firebase para o Mitria Space Command
const firebaseConfig = {
  apiKey: "AIzaSyCHcJ728uZgRgbPPcKrAmrLShX0kmJmiY",
  authDomain: "mitria-space-command.firebaseapp.com",
  projectId: "mitria-space-command",
  storageBucket: "mitria-space-command.appstorgorage.app",
  messagingSenderId: "134317688881",
  appId: "1:134317688881:web:416a1121be8ce272b5ed10",
  measurementId: "G-03QZZERVH5"
};

// Inicializa o Firebase com segurança
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Configura o provedor do Google para exibir o seletor de contas
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Função global para login com Google
function loginWithGoogle() {
  auth.signInWithPopup(googleProvider)
    .then((result) => {
      const user = result.user;
      // Verifica se o usuário já tem registro no Firestore, senão cria perfil zerado
      db.collection('users').doc(user.uid).get().then((doc) => {
        if (!doc.exists) {
          db.collection('users').doc(user.uid).set({
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
          }).then(() => {
            window.location.href = 'index.html';
          });
        } else {
          window.location.href = 'index.html';
        }
      });
    })
    .catch((error) => {
      console.error("Erro no login Google:", error);
      alert("Erro ao realizar login com o Google: " + error.message);
    });
}
