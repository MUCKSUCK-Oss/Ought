let workspaces = [];
let editingIndex = -1; 
let isEditMode = false; // Toggles between launching and editing

// Load Data
async function loadData() {
  const data = await chrome.storage.local.get(['workspaces']);
  if (data.workspaces && data.workspaces.length > 0) {
    workspaces = data.workspaces;
  } else {
    // Exact defaults from your mockup
    workspaces = [
      { name: "Code", urls: ["https://github.com", "https://stackoverflow.com"], isEntertainment: false },
      { name: "Study", urls: ["https://notion.so", "https://docs.google.com"], isEntertainment: false },
      { name: "Entertainment", urls: ["https://youtube.com", "https://netflix.com"], isEntertainment: true },
      { name: "Design", urls: ["https://figma.com", "https://dribbble.com"], isEntertainment: false }
    ];
  }
  renderHome();
}

async function saveData() {
  await chrome.storage.local.set({ workspaces });
  renderHome();
}

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
}

// Helpers for the UI
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

// Render the Main List
function renderHome() {
  const list = document.getElementById('workspace-list');
  list.innerHTML = '';
  
  workspaces.forEach((ws, index) => {
    const icon = getIconStyles(ws.name);
    const badgeClass = ws.isEntertainment ? 'badge-ent' : 'badge-work';
    const badgeText = ws.isEntertainment ? 'Entertain' : 'Work';
    
    // Create Card
    const card = document.createElement('div');
    card.className = 'ws-card';
    card.innerHTML = `
      <div class="ws-icon ${icon.class}">${icon.char}</div>
      <div class="ws-content">
        <div class="ws-title">${ws.name}</div>
        <div class="ws-sub">${getDomainString(ws.urls)}</div>
      </div>
      <div class="ws-badge ${badgeClass}">${badgeText}</div>
      <div class="ws-arrow">${isEditMode ? '✎' : '〉'}</div>
    `;

    card.onclick = () => {
      if (isEditMode) openEditScreen(index);
      else launchWorkspace(ws);
    };

    list.appendChild(card);
  });
}

// Toggle Edit Mode
document.getElementById('edit-mode-btn').onclick = (e) => {
  isEditMode = !isEditMode;
  e.target.style.color = isEditMode ? 'var(--primary)' : 'var(--text-light)';
  renderHome();
};

// Launch Logic
function launchWorkspace(ws) {
  if (!ws.urls || ws.urls.length === 0) return;

  if (ws.isEntertainment) {
    switchView('friction-view');
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

// Open Edit Form
function openEditScreen(index) {
  editingIndex = index;
  const ws = workspaces[index];
  
  document.getElementById('ws-name').value = ws.name;
  document.getElementById('ws-urls').value = ws.urls.join('\n');
  document.getElementById('ws-entertainment').checked = ws.isEntertainment;
  document.getElementById('delete-ws-btn').style.display = 'block'; 
  
  switchView('edit-view');
}

// Add New Workspace
document.getElementById('add-btn').onclick = () => {
  editingIndex = -1;
  document.getElementById('ws-name').value = '';
  document.getElementById('ws-urls').value = '';
  document.getElementById('ws-entertainment').checked = false;
  document.getElementById('delete-ws-btn').style.display = 'none'; 
  
  switchView('edit-view');
};

document.getElementById('back-btn').onclick = () => switchView('home-view');

// Save & Delete
document.getElementById('save-ws-btn').onclick = () => {
  const newWs = {
    name: document.getElementById('ws-name').value || 'New Workspace',
    urls: document.getElementById('ws-urls').value.split('\n').map(s => s.trim()).filter(Boolean),
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