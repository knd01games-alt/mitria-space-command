// Lógica de perfil, autenticação e estatísticas do jogador
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    // Se não estiver logado e não estiver na tela de login, redireciona
    if (!window.location.pathname.endsWith('login.html')) {
      window.location.href = 'login.html';
    }
  } else {
    // Jogador logado - Carrega os dados reais
    loadUserProfile(user);
  }
});

async function loadUserProfile(user) {
  const userRef = db.collection('users').doc(user.uid);
  const doc = await userRef.get();

  let userData = {};

  if (!doc.exists) {
    // Primeiro acesso: Cria perfil ZERADO para novo jogador
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

  // Atualiza Foto e Nome em todas as páginas (Header / Profile)
  updateUI(user, userData);
}

function updateUI(user, data) {
  // 1. Atualizar Saldo
  const balanceElems = document.querySelectorAll('.mth-balance, [data-mth-balance]');
  balanceElems.forEach(el => el.textContent = (data.mthBalance || 0).toFixed(2) + ' MTH');

  // 2. Atualizar Foto de Perfil (Header e Account Details)
  const userAvatar = document.querySelectorAll('.user-avatar, #profile-avatar');
  userAvatar.forEach(img => {
    if (img.tagName === 'IMG') {
      img.src = user.photoURL || data.photoURL || 'assets/default-avatar.png';
    }
  });

  // 3. Preencher Detalhes da Conta (Account Details)
  const usernameElem = document.getElementById('user-username');
  if (usernameElem) usernameElem.textContent = data.username || user.displayName;

  const emailElem = document.getElementById('user-email');
  if (emailElem) emailElem.textContent = user.email;

  const registeredElem = document.getElementById('user-registered');
  if (registeredElem) registeredElem.textContent = data.createdAt || 'Novo Usuário';

  // 4. Preencher Estatísticas do Perfil (Account Statistics)
  const minersPowerElem = document.getElementById('stat-miners-power');
  if (minersPowerElem) minersPowerElem.textContent = (data.minersPower || 0) + ' Th/s';

  const gamesPowerElem = document.getElementById('stat-games-power');
  if (gamesPowerElem) gamesPowerElem.textContent = (data.gamesPower || 0) + ' Th/s';

  const totalPowerElem = document.getElementById('stat-total-power');
  if (totalPowerElem) totalPowerElem.textContent = (data.totalPower || 0) + ' Th/s';

  // 5. Preencher Estatísticas dos Jogos (Game Statistics)
  const gamesPlayedElem = document.getElementById('stat-games-played');
  if (gamesPlayedElem) gamesPlayedElem.textContent = data.gamesPlayed || 0;

  const gamesWonElem = document.getElementById('stat-games-won');
  if (gamesWonElem) gamesWonElem.textContent = data.gamesWon || 0;
}

// Função para Logout
function logoutUser() {
  firebase.auth().signOut().then(() => {
    window.location.href = 'login.html';
  });
}
