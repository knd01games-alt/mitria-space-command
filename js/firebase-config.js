// Configuração limpa e otimizada do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCHcJ728uZgRgbPPcKrAmrLShX0kmJmiY",
  authDomain: "mitria-space-command.firebaseapp.com",
  projectId: "mitria-space-command",
  storageBucket: "mitria-space-command.appstorgorage.app",
  messagingSenderId: "134317688881",
  appId: "1:134317688881:web:416a1121be8ce272b5ed10",
  measurementId: "G-03QZZERVH5"
};

// Inicializa o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Provedor Google configurado para SELETOR DE CONTAS
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Trata o resultado do login quando o usuário retorna da tela do Google
auth.getRedirectResult().then((result) => {
  if (result.user) {
    const user = result.user;
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
  }
}).catch((error) => {
  console.error("Erro no retorno do login:", error);
});

// Função global acionada ao clicar no botão "Continuar com o Google"
function loginWithGoogle() {
  auth.signInWithRedirect(googleProvider);
}
