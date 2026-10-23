// Lógica de perfil, autenticação e telemetria do jogador/global

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    // Se não estiver logado e não estiver na tela de login, vai para o login
    if (!window.location.pathname.endsWith('login.html')) {
      window.location.href = 'login.html';
    }
  } else {
    // Jogador logado - Carrega os dados individuais e globais
    loadUserProfile(user);
    loadGlobalTelemetry();
  }
});

// Função acionada pelo botão do Google na tela de Login
function loginWithGoogle() {
  auth.signInWithPopup(googleProvider)
    .then((result) => {
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error("Erro no login:", error);
      alert("Erro ao realizar login com o Google: " + error.message);
    });
}

async function loadUserProfile(user) {
  const userRef = db.collection('users').doc(user.uid);
  const doc = await userRef.get();

  let userData = {};

  if (!doc.exists) {
    // Primeiro acesso: Perfil zerado para o novo jogador
    userData = {
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
    };
    await userRef.set(userData);
  } else {
    userData = doc.data();
  }

  updateUI(user, userData);
}

// Atualiza a interface com os dados reais do jogador
function updateUI(user, data) {
  // 1. Saldo em MTH
  const balanceElems = document.querySelectorAll('.mth-balance, [data-mth-balance], #user-balance');
  balanceElems.forEach(el => el.textContent = (data.mthBalance || 0).toFixed(2) + ' MTH');

  // 2. Poder do Jogador (Dashboard / Home)
  const myPowerElem = document.getElementById('my-total-power');
  if (myPowerElem) myPowerElem.textContent = (data.totalPower || 0).toFixed(1) + ' HS';

  // 3. Foto de Perfil (Header / Menu / Profile)
  const avatars = document.querySelectorAll('.user-avatar, #profile-avatar, .profile-pic');
  avatars.forEach(img => {
    if (img.tagName === 'IMG') {
      img.src = user.photoURL || data.photoURL || 'assets/default-avatar.png';
    }
  });

  // 4. Detalhes da Conta (Account Details / Profile)
  const usernameElem = document.getElementById('user-username');
  if (usernameElem) usernameElem.textContent = data.username || user.displayName;

  const emailElem = document.getElementById('user-email');
  if (emailElem) emailElem.textContent = user.email;

  const registeredElem = document.getElementById('user-registered');
  if (registeredElem) registeredElem.textContent = data.createdAt || 'Novo Usuário';

  // 5. Estatísticas da Conta (Account Statistics)
  const minersPowerElem = document.getElementById('stat-miners-power');
  if (minersPowerElem) minersPowerElem.textContent = (data.minersPower || 0) + ' Th/s';

  const gamesPowerElem = document.getElementById('stat-games-power');
  if (gamesPowerElem) gamesPowerElem.textContent = (data.gamesPower || 0) + ' Th/s';

  const totalPowerElem = document.getElementById('stat-total-power');
  if (totalPowerElem) totalPowerElem.textContent = (data.totalPower || 0) + ' Th/s';

  // 6. Estatísticas dos Jogos (Game Statistics)
  const gamesPlayedElem = document.getElementById('stat-games-played');
  if (gamesPlayedElem) gamesPlayedElem.textContent = data.gamesPlayed || 0;

  const gamesWonElem = document.getElementById('stat-games-won');
  if (gamesWonElem) gamesWonElem.textContent = data.gamesWon || 0;
}

// Telemetria Global: Soma o poder de todos os jogadores no Firestore
async function loadGlobalTelemetry() {
  try {
    const snapshot = await db.collection('users').get();
    let poolGlobal = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      poolGlobal += (data.totalPower || 0);
    });

    const globalPowerElem = document.getElementById('global-network-pool');
    if (globalPowerElem) {
      globalPowerElem.textContent = poolGlobal.toFixed(3) + ' Eh/s';
    }
  } catch (error) {
    console.error("Erro ao carregar telemetria global:", error);
  }
}

// Função de Logout (Desconectar)
function logoutUser() {
  auth.signOut().then(() => {
    window.location.href = 'login.html';
  });
}
