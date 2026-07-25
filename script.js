const app = document.querySelector('.app-shell');
const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('[data-view]');
const mainNav = document.querySelector('.main-nav');
const playButtons = document.querySelectorAll('.play-current');
const trackButtons = document.querySelectorAll('[data-track]');
const miniTitle = document.querySelector('#mini-title');
const miniArtist = document.querySelector('#mini-artist');
const nowTitle = document.querySelector('#playing-title');
const coverWord = document.querySelector('#cover-word');
const trackLength = document.querySelector('#track-length');
const elapsedTime = document.querySelector('#elapsed-time');
const progressFill = document.querySelector('#progress-fill');
const miniProgressFill = document.querySelector('#mini-progress-fill');
const miniCover = document.querySelector('#mini-cover');
const nowCover = document.querySelector('#now-cover');
const detailPanel = document.querySelector('#detail-panel');
const barProgressFill = document.querySelector('#bar-progress-fill');
const accountTrigger = document.querySelector('#account-trigger');
const accountPanel = document.querySelector('#account-panel');
const profileStatus = document.querySelector('#profile-status');
const sessionAction = document.querySelector('#session-action');
const settingsFeedback = document.querySelector('#settings-feedback');
const searchInput = document.querySelector('#search-input');
const searchHistory = document.querySelector('#search-history');
const allRecordsToggle = document.querySelector('#all-records-toggle');
const searchArea = document.querySelector('.search-area');
const settingsDetailTitle = document.querySelector('#settings-detail-title');
const settingsDetailIntro = document.querySelector('#settings-detail-intro');
const settingsDetailList = document.querySelector('#settings-detail-list');
const discoveryTabs = document.querySelectorAll('[data-discovery]');
const discoveryPanels = document.querySelectorAll('[data-discovery-panel]');
const localTabs = document.querySelectorAll('[data-local-tab]');
const localPanels = document.querySelectorAll('[data-local-panel]');
const nowFavorite = document.querySelector('#now-favorite');
const nowDownload = document.querySelector('#now-download');
const splashScreen = document.querySelector('#splash-screen');
const localAudio = document.querySelector('#local-audio');
const localUploadButton = document.querySelector('#local-upload-button');
const localAudioInput = document.querySelector('#local-audio-input');
const localLrcInput = document.querySelector('#local-lrc-input');
const localTrackList = document.querySelector('#local-track-list');
const localFavoritesList = document.querySelector('#local-favorites-list');
const localCount = document.querySelector('#local-count');
const localAllPanel = document.querySelector('[data-local-panel="all"]');
const localFavoritesPanel = document.querySelector('[data-local-panel="favorites"]');
const libraryLocalFavoritesList = document.querySelector('#library-local-favorites-list');
const libraryLocalFavoritesPanel = document.querySelector('#library-local-favorites-panel');
const recentList = document.querySelector('#recent-list');
const recentEmpty = document.querySelector('#recent-empty');
const heartButton = document.querySelector('#heart-button');
let isPlaying = false;
let elapsed = 48;
let duration = 167;
let activeDetail = 'lyrics';
let signedIn = true;
let selectedQuality = '高品质 / 320 kbps';
let localTracks = [];
let currentLocalTrackId = null;
let currentLocalAudioUrl = null;
let pendingLyricsTrackId = null;
let recentHistory = [];

document.body.classList.add('is-launching');
window.setTimeout(() => {
  splashScreen?.remove();
  document.body.classList.remove('is-launching');
}, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : 2550);
const lyricsByTrack = {
  '黑砧开炉': ['黑砧开炉，火星穿过黑夜', '每一个字，都压在鼓点上面', '把温度降到零度以下', '真话从不需要谁来加冕'],
  'No Gloss': ['没有滤镜，没有包装的色泽', '留在噪点里，才是我的规则', 'No gloss，别拿光来折射', '真实的裂缝比金属更热烈'],
  'Concrete Teeth': ['混凝土的牙齿咬住节拍', '脚步落下，街灯也被掀开', '每一次低频都不是意外', '这座城听见，绝不退开'],
  '重压之下': ['重压之下，呼吸依旧清醒', '把所有退路写成了声音', '冷却的世界没有侥幸', '只剩下我和这颗鼓心'],
  'No Retreat': ['No retreat，视线从不离开', '撞碎沉默，继续向前迈开', '没有回头，也无需对白', '零度之下，依然存在']
};

const settingsPages = {
  account: { title: '账号与安全', intro: '管理账户资料、登录方式与当前设备。所有操作仅在此原型中模拟展示。', rows: [['当前账户', 'CHANY / @tommy_rrrcnm', '已登录'], ['邮箱', 'hongsewugui@gmail.com', '修改'], ['登录密码', '上次修改于 2026.07', '更新'], ['设备管理', '当前设备：Windows Desktop', '查看']] },
  general: { title: '通用', intro: '控制播放行为、缓存策略与界面交互动效。', rows: [['自动播放', '播放列表结束后继续推荐', 'toggle', true], ['界面动效', '保留 SUBZERO 的统一交互动效', 'toggle', true], ['音频缓存', '当前缓存占用 126 MB', '清理'], ['音质', 'quality']] },
  privacy: { title: '隐私与权限', intro: '决定哪些资料可见，以及 zeromusic 可以使用哪些权限。', rows: [['公开资料', '允许其他用户查看昵称与头像', 'toggle', false], ['听歌记录', '用于生成个人推荐内容', 'toggle', true], ['通知', '新发行与播放提醒', 'toggle', false], ['权限说明', '查看完整的权限使用范围', '查看']] },
  about: { title: '关于 App', intro: 'zeromusic 是 SUBZERO 的线上声音频道，聚焦纯粹的音乐收听体验。', rows: [['版本', 'zeromusic v0.1.0', '已是最新'], ['厂牌', 'SUBZERO / 绝对零度', '官网'], ['成立地', '湖北省襄阳市', '信息'], ['服务条款', '阅读使用条款与隐私政策', '阅读']] },
  switch: { title: '切换账户', intro: '选择已有账户，或使用新的 zeromusic 账户登录。', rows: [['CHANY', '@tommy_rrrcnm / 当前账户', '当前'], ['添加账户', '使用其他邮箱或登录方式', '添加'], ['账户管理', '移除已保存的登录状态', '管理']] }
};
const labelWebsiteUrl = 'https://hongsewugui-cloud.github.io/subzero-website/';

function setView(view) {
  views.forEach((item) => item.classList.toggle('active', item.id === `${view}-view`));
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
  if (view === 'settings') {
    document.querySelectorAll('[data-setting]').forEach((item) => item.classList.remove('selected-setting'));
  }
  app.classList.remove('player-mode');
  if (view === 'now-playing') nowTitle.focus?.();
}

function renderSettingsPage(page) {
  const content = settingsPages[page];
  if (!content) return;
  settingsDetailTitle.textContent = content.title;
  settingsDetailIntro.textContent = content.intro;
  settingsDetailList.innerHTML = content.rows.map(([title, description, action, enabled]) => {
    if (action === 'toggle') return `<div class="detail-setting-row"><span><b>${title}</b><small>${description}</small></span><button class="detail-toggle" type="button" aria-pressed="${enabled}"><i></i></button></div>`;
    if (description === 'quality') return `<section class="quality-setting"><div><b>音质</b><small>当前：${selectedQuality}</small></div><div class="quality-options" role="radiogroup" aria-label="音质选择">${['标准 / 128 kbps', '高品质 / 320 kbps', '无损 / FLAC', 'Hi-Res / 24-bit'].map((quality) => `<button class="quality-option ${quality === selectedQuality ? 'selected' : ''}" type="button" data-quality="${quality}" role="radio" aria-checked="${quality === selectedQuality}">${quality}</button>`).join('')}</div></section>`;
    if (title === '厂牌') return `<div class="detail-setting-row"><span><b>${title}</b><small>${description}</small></span><a class="detail-setting-button label-link" data-label-link href="${labelWebsiteUrl}" aria-label="打开 SUBZERO 厂牌网站">${action} <span>↗</span></a></div>`;
    return `<div class="detail-setting-row"><span><b>${title}</b><small>${description}</small></span><button class="detail-setting-button" type="button">${action}</button></div>`;
  }).join('');
  setView('settings-detail');
}

function updatePlayButtons() {
  playButtons.forEach((button) => {
    const pauseMarkup = '<span class="pause-bars" aria-hidden="true"><i></i><i></i></span>';
    const playMarkup = '<span class="play-triangle" aria-hidden="true"></span>';
    button.innerHTML = isPlaying ? pauseMarkup : playMarkup;
    button.setAttribute('aria-label', isPlaying ? '暂停' : '播放');
    if (button.classList.contains('primary-button')) button.innerHTML = `${isPlaying ? pauseMarkup : playMarkup} ${isPlaying ? '暂停播放' : '播放精选'}`;
  });
  app.classList.toggle('is-playing', isPlaying);
}

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remaining = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${remaining}`;
}

function updateProgress() {
  const percentage = Math.min(100, (elapsed / duration) * 100);
  progressFill.style.width = `${percentage}%`;
  miniProgressFill.style.width = `${percentage}%`;
  barProgressFill.style.width = `${percentage}%`;
  elapsedTime.textContent = formatTime(elapsed);
}

function renderDetail(track) {
  if (activeDetail === 'credits') {
    detailPanel.innerHTML = `<dl class="credit-list"><div><dt>作词</dt><dd>Chany</dd></div><div><dt>作曲</dt><dd>Chany / SUBZERO</dd></div><div><dt>制作</dt><dd>SUBZERO ROOM</dd></div><div><dt>混音</dt><dd>ZERO ENGINEERING</dd></div></dl>`;
    return;
  }
  const localTrack = localTracks.find((item) => item.id === currentLocalTrackId);
  const lines = localTrack?.lyrics ? localTrack.lyrics.split(/\r?\n/).filter(Boolean) : (lyricsByTrack[track] || ['本地音频正在播放', '可在本地资料库为这首歌添加 LRC 歌词', '音频与歌词不会离开此设备']);
  detailPanel.innerHTML = `<div class="lyrics-content" id="lyrics-content">${lines.map((line, index) => `<span class="${index === 1 ? 'current-line' : ''}">${line}</span>`).join('')}</div>`;
}

function selectTrack(button) {
  const { track, artist, length, color } = button.dataset;
  if (currentLocalTrackId) localAudio.pause();
  currentLocalTrackId = null;
  miniTitle.textContent = track;
  miniArtist.textContent = artist;
  nowTitle.textContent = track;
  coverWord.innerHTML = track.includes(' ') ? track.replace(' ', '<br />') : track;
  renderDetail(track);
  trackLength.textContent = length;
  duration = length.split(':').reduce((total, unit) => total * 60 + Number(unit), 0);
  elapsed = 0;
  miniCover.textContent = button.querySelector('span')?.textContent?.trim().slice(0, 2) || '01';
  nowCover.classList.remove('is-yellow', 'is-black');
  if (color === 'yellow' || track === 'Concrete Teeth') nowCover.classList.add('is-yellow');
  if (color === 'black' || track === 'No Gloss') nowCover.classList.add('is-black');
  document.querySelectorAll('.track-row').forEach((item) => item.classList.toggle('current', item.dataset.track === track));
  document.querySelectorAll('.release-card').forEach((item) => item.classList.toggle('selected', item.dataset.track === track));
  recordRecentTrack({ key: `catalog:${track}`, source: 'catalog', title: track, artist, duration: length, playedAt: Date.now() });
  updateProgress();
}

function changeTrack(direction) {
  if (currentLocalTrackId && localTracks.length) {
    const currentIndex = localTracks.findIndex((item) => item.id === currentLocalTrackId);
    const nextTrack = localTracks[(currentIndex + direction + localTracks.length) % localTracks.length];
    playLocalTrack(nextTrack.id);
    return;
  }
  const tracks = Array.from(trackButtons);
  const currentIndex = tracks.findIndex((item) => item.dataset.track === nowTitle.textContent);
  const nextIndex = (currentIndex + direction + tracks.length) % tracks.length;
  selectTrack(tracks[nextIndex]);
  isPlaying = true;
  updatePlayButtons();
}

navItems.forEach((item) => item.addEventListener('click', () => setView(item.dataset.view)));
function updateNavOrder() {
  mainNav.querySelectorAll('.nav-item').forEach((item, index) => {
    item.querySelector('span').textContent = String(index + 1).padStart(2, '0');
  });
}

let draggedNavItem = null;
mainNav.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('dragstart', (event) => {
    draggedNavItem = item;
    item.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
  });
  item.addEventListener('dragend', () => {
    item.classList.remove('dragging');
    mainNav.querySelectorAll('.nav-item').forEach((navItem) => navItem.classList.remove('drop-target'));
  });
  item.addEventListener('dragover', (event) => {
    event.preventDefault();
    if (item !== draggedNavItem) item.classList.add('drop-target');
  });
  item.addEventListener('dragleave', () => item.classList.remove('drop-target'));
  item.addEventListener('drop', (event) => {
    event.preventDefault();
    if (!draggedNavItem || draggedNavItem === item) return;
    const insertAfter = event.clientY > item.getBoundingClientRect().top + item.offsetHeight / 2;
    mainNav.insertBefore(draggedNavItem, insertAfter ? item.nextSibling : item);
    updateNavOrder();
  });
});
discoveryTabs.forEach((tab) => tab.addEventListener('click', () => {
  const selection = tab.dataset.discovery;
  const willExpand = tab.getAttribute('aria-expanded') !== 'true';
  discoveryTabs.forEach((item) => {
    const active = item === tab && willExpand;
    item.classList.toggle('active', active);
    item.setAttribute('aria-expanded', String(active));
  });
  discoveryPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.discoveryPanel === selection && willExpand));
}));
localTabs.forEach((tab) => tab.addEventListener('click', () => {
  const selection = tab.dataset.localTab;
  localTabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
  });
  localPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.localPanel === selection));
}));

function openLocalMusicDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('zeromusic-local-library', 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('tracks')) request.result.createObjectStore('tracks', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function writeLocalTrack(track) {
  const db = await openLocalMusicDb();
  await new Promise((resolve, reject) => {
    const request = db.transaction('tracks', 'readwrite').objectStore('tracks').put(track);
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
  });
  db.close();
}

function escapeMarkup(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function formatFileSize(bytes) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function parseLocalFileName(fileName) {
  const baseName = fileName.replace(/\.[^.]+$/, '').trim();
  const parts = baseName.split(/\s+-\s+/);
  return parts.length > 1 ? { artist: parts.shift(), title: parts.join(' - ') } : { artist: '本地导入', title: baseName || '未命名音频' };
}

function readAudioDuration(file) {
  return new Promise((resolve) => {
    const probe = document.createElement('audio');
    const url = URL.createObjectURL(file);
    probe.preload = 'metadata';
    probe.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(Number.isFinite(probe.duration) ? Math.round(probe.duration) : 0); };
    probe.onerror = () => { URL.revokeObjectURL(url); resolve(0); };
    probe.src = url;
  });
}

function renderLocalRows(tracks, target) {
  target.innerHTML = tracks.map((track) => {
    const trackTitle = escapeMarkup(track.title);
    const trackArtist = escapeMarkup(track.artist);
    const detail = `${trackArtist} / ${escapeMarkup(track.format)} / ${formatTime(track.duration || 0)} / ${formatFileSize(track.size)}`;
    return `<li class="local-track-row ${track.id === currentLocalTrackId ? 'is-current' : ''}" data-local-id="${track.id}"><button class="local-track-play" type="button" data-local-action="play" aria-label="播放 ${trackTitle}">${track.id === currentLocalTrackId && isPlaying ? 'Ⅱ' : '▶'}</button><span class="local-track-info"><b>${trackTitle}</b><small>${detail}</small></span><div class="local-track-actions"><button class="local-track-action ${track.favorite ? 'is-favorite' : ''}" type="button" data-local-action="favorite" aria-pressed="${track.favorite}" aria-label="收藏 ${trackTitle}">${track.favorite ? '♥' : '♡'}</button><button class="local-track-action" type="button" data-local-action="lyrics" aria-label="为 ${trackTitle} 添加本地歌词">LRC</button></div></li>`;
  }).join('');
}

function loadRecentHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem('zeromusic-recent-history') || '[]');
    recentHistory = Array.isArray(saved) ? saved : [];
  } catch {
    recentHistory = [];
  }
}

function formatRecentDate(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startYesterday = startToday - 86400000;
  if (timestamp >= startToday) return '今天';
  if (timestamp >= startYesterday) return '昨天';
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function recordRecentTrack(entry) {
  recentHistory = [entry, ...recentHistory.filter((item) => item.key !== entry.key)].slice(0, 50);
  try { localStorage.setItem('zeromusic-recent-history', JSON.stringify(recentHistory)); } catch {}
  renderRecentHistory();
}

function renderRecentHistory() {
  recentList.innerHTML = recentHistory.map((item) => `<li><button class="recent-track" type="button" data-recent-key="${escapeMarkup(item.key)}"><b>${formatRecentDate(item.playedAt)}</b><span>${escapeMarkup(item.title)}<small>${escapeMarkup(item.artist)} · ${item.source === 'local' ? '本地音乐' : 'SUBZERO SELECTS'}</small></span><em>${escapeMarkup(item.duration || '00:00')}</em></button></li>`).join('');
  recentEmpty.hidden = recentHistory.length > 0;
}

function renderLocalLibrary() {
  const favorites = localTracks.filter((track) => track.favorite);
  localCount.textContent = `THIS DEVICE / ${localTracks.length} TRACK${localTracks.length === 1 ? '' : 'S'}`;
  renderLocalRows(localTracks, localTrackList);
  renderLocalRows(favorites, localFavoritesList);
  renderLocalRows(favorites, libraryLocalFavoritesList);
  localAllPanel.classList.toggle('has-tracks', localTracks.length > 0);
  localFavoritesPanel.classList.toggle('has-tracks', favorites.length > 0);
  libraryLocalFavoritesPanel.classList.toggle('has-tracks', favorites.length > 0);
}

async function loadLocalLibrary() {
  try {
    const db = await openLocalMusicDb();
    localTracks = await new Promise((resolve, reject) => {
      const request = db.transaction('tracks', 'readonly').objectStore('tracks').getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => b.addedAt - a.addedAt));
      request.onerror = () => reject(request.error);
    });
    db.close();
    renderLocalLibrary();
  } catch {
    localCount.textContent = 'THIS DEVICE / STORAGE UNAVAILABLE';
  }
}

async function playLocalTrack(id) {
  const track = localTracks.find((item) => item.id === id);
  if (!track?.blob) return;
  if (currentLocalTrackId !== id) {
    if (currentLocalAudioUrl) URL.revokeObjectURL(currentLocalAudioUrl);
    currentLocalAudioUrl = URL.createObjectURL(track.blob);
    localAudio.src = currentLocalAudioUrl;
    currentLocalTrackId = id;
    miniTitle.textContent = track.title;
    miniArtist.textContent = track.artist;
    nowTitle.textContent = track.title;
    coverWord.textContent = 'LOCAL';
    miniCover.textContent = 'LO';
    nowCover.classList.remove('is-yellow', 'is-black');
    duration = track.duration || 0;
    elapsed = 0;
    trackLength.textContent = formatTime(duration);
    renderDetail(track.title);
    nowFavorite.setAttribute('aria-pressed', String(track.favorite));
    nowFavorite.classList.toggle('active', track.favorite);
    nowFavorite.textContent = track.favorite ? '♥ 已收藏' : '♡ 收藏';
    heartButton.textContent = track.favorite ? '♥' : '♡';
  }
  try {
    await localAudio.play();
    isPlaying = true;
    recordRecentTrack({ key: `local:${track.id}`, source: 'local', id: track.id, title: track.title, artist: track.artist, duration: formatTime(track.duration || 0), playedAt: Date.now() });
    updatePlayButtons();
    renderLocalLibrary();
  } catch {
    isPlaying = false;
    updatePlayButtons();
  }
}

async function toggleLocalPlayback() {
  if (!currentLocalTrackId) return;
  if (localAudio.paused) await playLocalTrack(currentLocalTrackId);
  else localAudio.pause();
}

async function toggleLocalFavorite(id) {
  const track = localTracks.find((item) => item.id === id);
  if (!track) return;
  if (track.favorite) {
    const favoriteRows = Array.from(document.querySelectorAll('.local-track-row[data-local-id]')).filter((row) => row.dataset.localId === id);
    favoriteRows.forEach((row) => row.classList.add('is-removing'));
    if (favoriteRows.length) await new Promise((resolve) => window.setTimeout(resolve, 180));
  }
  track.favorite = !track.favorite;
  await writeLocalTrack(track);
  renderLocalLibrary();
  if (id === currentLocalTrackId) {
    nowFavorite.setAttribute('aria-pressed', String(track.favorite));
    nowFavorite.classList.toggle('active', track.favorite);
    nowFavorite.textContent = track.favorite ? '♥ 已收藏' : '♡ 收藏';
    heartButton.textContent = track.favorite ? '♥' : '♡';
  }
}

localUploadButton.addEventListener('click', () => localAudioInput.click());
localAudioInput.addEventListener('change', async () => {
  const files = Array.from(localAudioInput.files || []).filter((file) => file.type.startsWith('audio/') || /\.(mp3|wav|m4a|flac)$/i.test(file.name));
  for (const file of files) {
    const metadata = parseLocalFileName(file.name);
    const track = { id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, title: metadata.title, artist: metadata.artist, format: (file.name.split('.').pop() || 'AUDIO').toUpperCase(), size: file.size, duration: await readAudioDuration(file), favorite: false, lyrics: '', addedAt: Date.now(), blob: file };
    await writeLocalTrack(track);
    localTracks.unshift(track);
  }
  localAudioInput.value = '';
  renderLocalLibrary();
});

function attachLocalLyrics(event) {
  const action = event.target.closest('[data-local-action]');
  if (!action) return;
  const trackId = event.target.closest('[data-local-id]')?.dataset.localId;
  if (!trackId) return;
  if (action.dataset.localAction === 'play') playLocalTrack(trackId);
  if (action.dataset.localAction === 'favorite') toggleLocalFavorite(trackId);
  if (action.dataset.localAction === 'lyrics') { pendingLyricsTrackId = trackId; localLrcInput.click(); }
}

localTrackList.addEventListener('click', attachLocalLyrics);
localFavoritesList.addEventListener('click', attachLocalLyrics);
libraryLocalFavoritesList.addEventListener('click', attachLocalLyrics);
recentList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-recent-key]');
  if (!button) return;
  const item = recentHistory.find((record) => record.key === button.dataset.recentKey);
  if (!item) return;
  if (item.source === 'local') playLocalTrack(item.id);
  else {
    const catalogButton = Array.from(trackButtons).find((trackButton) => trackButton.dataset.track === item.title);
    if (catalogButton) { selectTrack(catalogButton); isPlaying = true; updatePlayButtons(); }
  }
});
localLrcInput.addEventListener('change', async () => {
  const file = localLrcInput.files?.[0];
  const track = localTracks.find((item) => item.id === pendingLyricsTrackId);
  if (!file || !track) return;
  track.lyrics = await file.text();
  await writeLocalTrack(track);
  if (track.id === currentLocalTrackId) renderDetail(track.title);
  localLrcInput.value = '';
  pendingLyricsTrackId = null;
  renderLocalLibrary();
});

localAudio.addEventListener('loadedmetadata', () => {
  duration = Math.round(localAudio.duration || duration || 0);
  elapsed = 0;
  trackLength.textContent = formatTime(duration);
  updateProgress();
});
localAudio.addEventListener('timeupdate', () => {
  if (!currentLocalTrackId) return;
  elapsed = Math.floor(localAudio.currentTime || 0);
  duration = Math.round(localAudio.duration || duration || 0);
  updateProgress();
});
localAudio.addEventListener('pause', () => { if (currentLocalTrackId) { isPlaying = false; updatePlayButtons(); renderLocalLibrary(); } });
localAudio.addEventListener('play', () => { if (currentLocalTrackId) { isPlaying = true; updatePlayButtons(); renderLocalLibrary(); } });
localAudio.addEventListener('ended', () => { isPlaying = false; updatePlayButtons(); renderLocalLibrary(); });
miniCover.addEventListener('click', () => setView('now-playing'));
trackButtons.forEach((item) => item.addEventListener('click', () => { selectTrack(item); isPlaying = true; updatePlayButtons(); }));
document.querySelectorAll('[aria-label="上一首"]').forEach((button) => button.addEventListener('click', () => changeTrack(-1)));
document.querySelectorAll('[aria-label="下一首"]').forEach((button) => button.addEventListener('click', () => changeTrack(1)));
playButtons.forEach((button) => button.addEventListener('click', () => {
  if (currentLocalTrackId) { toggleLocalPlayback(); return; }
  isPlaying = !isPlaying;
  updatePlayButtons();
}));

document.querySelector('#progress-button').addEventListener('click', (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  elapsed = Math.round(((event.clientX - rect.left) / rect.width) * duration);
  if (currentLocalTrackId) localAudio.currentTime = elapsed;
  updateProgress();
});

document.querySelector('#bar-progress').addEventListener('click', (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  elapsed = Math.round(((event.clientX - rect.left) / rect.width) * duration);
  if (currentLocalTrackId) localAudio.currentTime = elapsed;
  updateProgress();
});

heartButton.addEventListener('click', (event) => {
  if (currentLocalTrackId) { toggleLocalFavorite(currentLocalTrackId); return; }
  event.currentTarget.classList.toggle('liked');
  event.currentTarget.textContent = event.currentTarget.classList.contains('liked') ? '♥' : '♡';
  event.currentTarget.classList.remove('heart-bloom');
  void event.currentTarget.offsetWidth;
  event.currentTarget.classList.add('heart-bloom');
});

function togglePlayerAction(button, activeText, idleText) {
  const active = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(active));
  button.classList.toggle('active', active);
  button.textContent = active ? activeText : idleText;
  button.classList.remove('action-pop');
  void button.offsetWidth;
  button.classList.add('action-pop');
}

nowFavorite.addEventListener('click', () => {
  if (currentLocalTrackId) { toggleLocalFavorite(currentLocalTrackId); return; }
  togglePlayerAction(nowFavorite, '♥ 已收藏', '♡ 收藏');
});
nowDownload.addEventListener('click', () => togglePlayerAction(nowDownload, '✓ 已下载', '↓ 下载'));

document.querySelectorAll('.detail-tab').forEach((tab) => tab.addEventListener('click', () => {
  activeDetail = tab.dataset.detail;
  document.querySelectorAll('.detail-tab').forEach((item) => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
  });
  renderDetail(nowTitle.textContent);
}));

function openAccountPanel() {
  accountPanel.classList.add('open');
  accountPanel.setAttribute('aria-hidden', 'false');
  accountTrigger.setAttribute('aria-expanded', 'true');
}

function closeAccountPanel() {
  accountPanel.classList.remove('open');
  accountPanel.setAttribute('aria-hidden', 'true');
  accountTrigger.setAttribute('aria-expanded', 'false');
}

function updateSessionUI() {
  accountTrigger.querySelector('b').textContent = signedIn ? 'CHANY' : '登录 zeromusic';
  accountTrigger.querySelector('small').textContent = signedIn ? '账户中心' : '使用账户继续';
  sessionAction.innerHTML = signedIn ? '退出登录 <span>↗</span>' : '登录 <span>→</span>';
  profileStatus.textContent = signedIn ? '已登录 / SUBZERO MEMBER' : '尚未登录 / 点击登录继续';
}

accountTrigger.addEventListener('click', openAccountPanel);
document.querySelector('#profile-close').addEventListener('click', closeAccountPanel);
accountPanel.addEventListener('click', (event) => { if (event.target === accountPanel) closeAccountPanel(); });
document.querySelectorAll('#account-panel [data-view]').forEach((item) => item.addEventListener('click', () => {
  setView(item.dataset.view);
  closeAccountPanel();
}));

document.querySelectorAll('[data-account-action]').forEach((item) => item.addEventListener('click', () => {
  item.classList.remove('action-pop');
  void item.offsetWidth;
  item.classList.add('action-pop');
  if (item.dataset.accountAction === 'switch') {
    profileStatus.textContent = '账户选择器已准备就绪。';
    return;
  }
  signedIn = !signedIn;
  updateSessionUI();
}));

const settingCopy = {
  account: '账号与安全：登录方式、密码与设备管理。',
  general: '通用：播放、缓存与交互动效。',
  privacy: '隐私与权限：个人资料、通知与设备权限。',
  about: 'zeromusic v0.1 / SUBZERO 线上声音频道。',
  switch: '已打开账户选择器。',
  session: '当前账户状态已更新。'
};

document.querySelectorAll('[data-setting]').forEach((item) => item.addEventListener('click', () => {
  settingsFeedback.textContent = settingCopy[item.dataset.setting];
  document.querySelectorAll('[data-setting]').forEach((row) => row.classList.toggle('selected-setting', row === item));
  if (item.dataset.setting === 'session') {
    signedIn = !signedIn;
    updateSessionUI();
    settingsFeedback.textContent = signedIn ? '已登录 CHANY。' : '已退出登录。';
    return;
  }
  renderSettingsPage(item.dataset.setting);
}));

document.querySelector('#settings-back').addEventListener('click', () => setView('settings'));
settingsDetailList.addEventListener('click', (event) => {
  const labelLink = event.target.closest('[data-label-link]');
  if (labelLink) {
    labelLink.classList.remove('action-pop');
    void labelLink.offsetWidth;
    labelLink.classList.add('action-pop');
    return;
  }
  const toggle = event.target.closest('.detail-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(toggle.getAttribute('aria-pressed') !== 'true'));
    return;
  }
  const qualityOption = event.target.closest('[data-quality]');
  if (qualityOption) {
    selectedQuality = qualityOption.dataset.quality;
    renderSettingsPage('general');
    return;
  }
  const detailAction = event.target.closest('.detail-setting-button');
  if (detailAction) {
    detailAction.classList.remove('action-pop');
    void detailAction.offsetWidth;
    detailAction.classList.add('action-pop');
    detailAction.textContent = detailAction.textContent === '已完成' ? '处理' : '已完成';
  }
});

document.querySelectorAll('[aria-label="随机播放"], [aria-label="循环播放"]').forEach((button) => button.addEventListener('click', () => {
  const active = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(active));
  button.classList.toggle('active', active);
  button.classList.remove('action-pop');
  void button.offsetWidth;
  button.classList.add('action-pop');
}));

const volumeButton = document.querySelector('.volume-button');
volumeButton.addEventListener('click', () => {
  const muted = volumeButton.getAttribute('aria-pressed') === 'true';
  volumeButton.setAttribute('aria-pressed', String(!muted));
  volumeButton.textContent = muted ? '◖' : '⊘';
  volumeButton.setAttribute('aria-label', muted ? '静音' : '取消静音');
  volumeButton.classList.remove('action-pop');
  void volumeButton.offsetWidth;
  volumeButton.classList.add('action-pop');
});

function filterSearch(query) {
  document.querySelectorAll('.track-row, .release-card').forEach((item) => {
    item.style.opacity = !query || item.textContent.toLowerCase().includes(query) ? '1' : '.25';
  });
}

searchInput.addEventListener('focus', () => {
  searchHistory.classList.add('open');
  searchHistory.setAttribute('aria-hidden', 'false');
});
searchInput.addEventListener('input', (event) => filterSearch(event.target.value.trim().toLowerCase()));
document.querySelectorAll('.search-record').forEach((record) => record.addEventListener('click', () => {
  searchInput.value = record.dataset.query;
  filterSearch(record.dataset.query.toLowerCase());
  searchInput.focus();
}));
allRecordsToggle.addEventListener('click', () => {
  const expanded = searchHistory.classList.toggle('show-all');
  allRecordsToggle.firstChild.textContent = expanded ? '收起记录 ' : '全部记录 ';
});
document.querySelector('#clear-search-history').addEventListener('click', () => {
  document.querySelector('#search-records').innerHTML = '<p class="empty-search-records">暂无搜索记录</p>';
  allRecordsToggle.style.display = 'none';
});
document.addEventListener('click', (event) => {
  if (!searchArea.contains(event.target)) {
    searchHistory.classList.remove('open');
    searchHistory.setAttribute('aria-hidden', 'true');
  }
});

setInterval(() => {
  if (!isPlaying || currentLocalTrackId) return;
  elapsed = elapsed >= duration ? 0 : elapsed + 1;
  updateProgress();
}, 1000);

updateProgress();
loadRecentHistory();
renderRecentHistory();
loadLocalLibrary();
