const firebaseConfig = {
  apiKey: "AIzaSyCHcJ728uZgRgbPPcKrAmrLShX0kmJmiY",
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

// Provedor Google com forçamento de seletor de contas
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Função para Entrar/Cadastrar com o Google
function loginWithGoogle() {
  auth.signInWithPopup(googleProvider)
    .then(async (result) => {
      const user = result.user;
      const userDoc = await db.collection('users').doc(user.uid).get();

      if (!userDoc.exists) {
        // Novo Usuário: Cria Perfil Zerado
        await db.collection('users').doc(user.uid).set({
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
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error("Erro no login Google:", error);
      alert("Erro ao conectar com o Google: " + error.message);
    });
}
