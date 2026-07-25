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
let isPlaying = false;
let elapsed = 48;
let duration = 167;
let activeDetail = 'lyrics';
let signedIn = true;
let selectedQuality = '高品质 / 320 kbps';
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
  const lines = lyricsByTrack[track] || lyricsByTrack['黑砧开炉'];
  detailPanel.innerHTML = `<div class="lyrics-content" id="lyrics-content">${lines.map((line, index) => `<span class="${index === 1 ? 'current-line' : ''}">${line}</span>`).join('')}</div>`;
}

function selectTrack(button) {
  const { track, artist, length, color } = button.dataset;
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
  updateProgress();
}

function changeTrack(direction) {
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
miniCover.addEventListener('click', () => setView('now-playing'));
trackButtons.forEach((item) => item.addEventListener('click', () => { selectTrack(item); isPlaying = true; updatePlayButtons(); }));
document.querySelectorAll('[aria-label="上一首"]').forEach((button) => button.addEventListener('click', () => changeTrack(-1)));
document.querySelectorAll('[aria-label="下一首"]').forEach((button) => button.addEventListener('click', () => changeTrack(1)));
playButtons.forEach((button) => button.addEventListener('click', () => { isPlaying = !isPlaying; updatePlayButtons(); }));

document.querySelector('#progress-button').addEventListener('click', (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  elapsed = Math.round(((event.clientX - rect.left) / rect.width) * duration);
  updateProgress();
});

document.querySelector('#bar-progress').addEventListener('click', (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  elapsed = Math.round(((event.clientX - rect.left) / rect.width) * duration);
  updateProgress();
});

document.querySelector('#heart-button').addEventListener('click', (event) => {
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

nowFavorite.addEventListener('click', () => togglePlayerAction(nowFavorite, '♥ 已收藏', '♡ 收藏'));
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
  if (!isPlaying) return;
  elapsed = elapsed >= duration ? 0 : elapsed + 1;
  updateProgress();
}, 1000);

updateProgress();
