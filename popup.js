let workspaces = [];
let editingIndex = -1; 
let isDarkMode = false;

const quotes = [
  "\"Your results are the product of either personal focus or personal distractions.\" - Darren Hardy",
  "\"An addiction to distraction is the end of your creative production.\" - Robin Sharma",
  "\"Say 'no' to distraction so you can say 'yes' to your destiny.\" - Anonymous",
  "\"Focus on being productive instead of busy.\" - Tim Ferriss",
  "\"Starve your distractions, feed your focus.\" - Anonymous"
];

async function loadData() {
  const data = await chrome.storage.local.get(['workspaces', 'isDarkMode']);
  
  if (data.isDarkMode !== undefined) {
    isDarkMode = data.isDarkMode;
    applyTheme();
  }

  if (data.workspaces && data.workspaces.length > 0) {
    workspaces = data.workspaces;
  } else {
    workspaces = [
      { name: "Code", urls: ["https://github.com", "https://stackoverflow.com"], isEntertainment: false },
      { name: "Entertainment", urls: ["https://youtube.com"], isEntertainment: true }
    ];
  }
  renderHome();
}

async function saveData() {
  await chrome.storage.local.set({ workspaces, isDarkMode });
  renderHome();
}

function applyTheme() {
  const themeBtn = document.getElementById('theme-btn');
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    themeBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    themeBtn.textContent = '🌙';
  }
}

document.getElementById('theme-btn').onclick = () => {
  isDarkMode = !isDarkMode;
  applyTheme();
  chrome.storage.local.set({ isDarkMode });
};

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
}

function getDomainString(urls) {
  if (!urls || urls.length === 0) return "No links added";
  return urls.map(url => {
    try { return new URL(url).hostname.replace('www.', ''); } 
    catch { return url; }
  }).join(', ');
}

function getIconStyles(name) {
  const lower = name.toLowerCase();
  if (lower.includes('code')) return { class: 'icon-code', char: '&lt;/&gt;' };
  if (lower.includes('study') || lower.includes('read')) return { class: 'icon-study', char: '📚' };
  if (lower.includes('entertain') || lower.includes('game') || lower.includes('play')) return { class: 'icon-entertain', char: '🎮' };
  if (lower.includes('design') || lower.includes('art')) return { class: 'icon-design', char: '🎨' };
  return { class: 'icon-default', char: '📁' };
}

function renderHome() {
  const list = document.getElementById('workspace-list');
  list.innerHTML = '';
  
  workspaces.forEach((ws, index) => {
    const icon = getIconStyles(ws.name);
    const badgeClass = ws.isEntertainment ? 'badge-ent' : 'badge-work';
    const badgeText = ws.isEntertainment ? 'Entertain' : 'Work';
    
    const card = document.createElement('div');
    card.className = 'ws-card';
    card.innerHTML = `
      <div class="ws-icon ${icon.class}">${icon.char}</div>
      <div class="ws-content">
        <div class="ws-title">${ws.name}</div>
        <div class="ws-sub">${getDomainString(ws.urls)}</div>
      </div>
      <div class="ws-badge ${badgeClass}">${badgeText}</div>
      <button class="edit-card-btn" title="Edit Workspace">✎</button>
    `;

    
    card.onclick = () => launchWorkspace(ws);
    
    const editBtn = card.querySelector('.edit-card-btn');
    editBtn.onclick = (e) => {
      e.stopPropagation(); 
      openEditScreen(index);
    };

    list.appendChild(card);
  });
}

function launchWorkspace(ws) {
  if (!ws.urls || ws.urls.length === 0) return;

  if (ws.isEntertainment) {
    switchView('friction-view');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote-text').textContent = randomQuote;

    let sec = 10;
    const timerEl = document.getElementById('timer-text');
    timerEl.textContent = `Launching in ${sec} seconds`;
    
    const interval = setInterval(() => {
      sec--;
      timerEl.textContent = `Launching in ${sec} seconds`;
      if (sec <= 0) {
        clearInterval(interval);
        openUrls(ws.urls);
        window.close(); 
      }
    }, 1000);

    document.getElementById('cancel-friction-btn').onclick = () => {
      clearInterval(interval);
      switchView('home-view');
    };
  } else {
    openUrls(ws.urls);
    window.close(); 
  }
}

function openUrls(urls) {
  urls.forEach(url => {
    let cleanUrl = url.trim();
    if (cleanUrl && !cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl;
    if (cleanUrl) chrome.tabs.create({ url: cleanUrl });
  });
}

function addUrlInput(value = '') {
  const container = document.getElementById('url-container');
  const row = document.createElement('div');
  row.className = 'url-row';
  row.innerHTML = `
    <input type="text" class="url-input" placeholder="https://..." value="${value}">
    <button class="remove-url-btn" title="Remove Link">✖</button>
  `;
  
  row.querySelector('.remove-url-btn').onclick = () => row.remove();
  container.appendChild(row);
}

document.getElementById('add-url-btn').onclick = () => addUrlInput('');

document.getElementById('capture-tabs-btn').onclick = async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const currentTabUrls = tabs.map(t => t.url).filter(u => u && !u.startsWith('chrome://'));
  
  const existingInputs = Array.from(document.querySelectorAll('.url-input')).map(inp => inp.value.trim());
  
  currentTabUrls.forEach(url => {
    if (!existingInputs.includes(url)) {
      addUrlInput(url);
    }
  });
};

function openEditScreen(index) {
  editingIndex = index;
  const ws = workspaces[index];
  
  document.getElementById('ws-name').value = ws.name;
  
  const urlContainer = document.getElementById('url-container');
  urlContainer.innerHTML = ''; 
  if (ws.urls.length === 0) {
    addUrlInput(''); 

  } else {
    ws.urls.forEach(url => addUrlInput(url));
  }

  document.getElementById('ws-entertainment').checked = ws.isEntertainment;
  document.getElementById('delete-ws-btn').style.display = 'block'; 
  
  switchView('edit-view');
}

document.getElementById('add-btn').onclick = () => {
  editingIndex = -1;
  document.getElementById('ws-name').value = '';
  
  const urlContainer = document.getElementById('url-container');
  urlContainer.innerHTML = '';
  addUrlInput(''); 

  document.getElementById('ws-entertainment').checked = false;
  document.getElementById('delete-ws-btn').style.display = 'none'; 
  
  switchView('edit-view');
};

document.getElementById('back-btn').onclick = () => switchView('home-view');

document.getElementById('save-ws-btn').onclick = () => {

  const urlInputs = document.querySelectorAll('.url-input');
  const scrapedUrls = Array.from(urlInputs).map(inp => inp.value.trim()).filter(Boolean);

  const newWs = {
    name: document.getElementById('ws-name').value || 'New Workspace',
    urls: scrapedUrls,
    isEntertainment: document.getElementById('ws-entertainment').checked
  };

  if (editingIndex >= 0) workspaces[editingIndex] = newWs; 
  else workspaces.push(newWs); 
  
  saveData();
  switchView('home-view');
};

document.getElementById('delete-ws-btn').onclick = () => {
  if (editingIndex >= 0) {
    workspaces.splice(editingIndex, 1);
    saveData();
    switchView('home-view');
  }
};

loadData();
