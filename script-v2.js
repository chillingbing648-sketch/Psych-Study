'use strict';

/**
 * ═══════════════════════════════════════════════════════════
 *  PSYCHSTUDY 2.0 — REFACTORED APPLICATION
 *  Complete modular vanilla JS with improved architecture
 *  Features: Modular design, mastery engine, localStorage layer,
 *            better UX/accessibility, mobile-first
 * ═══════════════════════════════════════════════════════════
 */

// ──────────────────────────────────────────────────────────
// STORAGE SERVICE — Safe persistent data layer
// ──────────────────────────────────────────────────────────
const StorageService = (() => {
  const PREFIX = 'psychstudy_v2_';
  
  return {
    get(key, defaultValue = null) {
      try {
        const stored = localStorage.getItem(PREFIX + key);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch (err) {
        console.error(`Storage.get("${key}") error:`, err);
        return defaultValue;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.error(`Storage.set("${key}") error:`, err);
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(PREFIX + key);
        return true;
      } catch (err) {
        console.error(`Storage.remove("${key}") error:`, err);
        return false;
      }
    },

    addToArray(key, item) {
      const arr = this.get(key, []);
      if (!Array.isArray(arr)) return false;
      arr.unshift(item);
      return this.set(key, arr);
    },

    removeFromArray(key, itemId) {
      const arr = this.get(key, []);
      if (!Array.isArray(arr)) return false;
      const filtered = arr.filter(item => item.id !== itemId);
      return this.set(key, filtered);
    },

    updateInArray(key, itemId, updates) {
      const arr = this.get(key, []);
      if (!Array.isArray(arr)) return false;
      const updated = arr.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      );
      return this.set(key, updated);
    }
  };
})();

// ──────────────────────────────────────────────────────────
// MASTERY ENGINE — Local learning analytics
// ──────────────────────────────────────────────────────────
const MasteryEngine = (() => {
  function getTopicMastery(topicId) {
    const masteryData = StorageService.get('masteryData', {});
    if (!masteryData[topicId]) {
      masteryData[topicId] = {
        topicId,
        studied: false,
        studiedDates: [],
        quizAttempts: [],
        totalCorrect: 0,
        totalAttempts: 0,
        accuracy: 0,
        confidenceLevel: 0,
        lastStudied: null,
        createdAt: new Date().toISOString()
      };
      StorageService.set('masteryData', masteryData);
    }
    return masteryData[topicId];
  }

  function recordStudySession(topicId) {
    const masteryData = StorageService.get('masteryData', {});
    if (!masteryData[topicId]) {
      masteryData[topicId] = getTopicMastery(topicId);
    }
    const record = masteryData[topicId];
    record.studied = true;
    record.studiedDates.push(new Date().toISOString());
    record.lastStudied = new Date().toISOString();
    StorageService.set('masteryData', masteryData);
  }

  function recordQuizAttempt(topicId, score, totalQuestions) {
    const masteryData = StorageService.get('masteryData', {});
    if (!masteryData[topicId]) {
      masteryData[topicId] = getTopicMastery(topicId);
    }
    const record = masteryData[topicId];
    const accuracy = Math.round((score / totalQuestions) * 100);
    record.quizAttempts.push({
      score, totalQuestions, accuracy,
      timestamp: new Date().toISOString()
    });
    record.totalCorrect += score;
    record.totalAttempts += totalQuestions;
    record.accuracy = Math.round((record.totalCorrect / record.totalAttempts) * 100);
    const recentAttempts = record.quizAttempts.slice(-3);
    record.confidenceLevel = Math.round(
      recentAttempts.reduce((sum, a) => sum + a.accuracy, 0) / recentAttempts.length
    );
    StorageService.set('masteryData', masteryData);
    return record;
  }

  function getMasteryLevel(masteryRecord) {
    if (!masteryRecord.studied) return 'notStarted';
    if (masteryRecord.accuracy === 0) return 'notStarted';
    if (masteryRecord.accuracy < 50) return 'weak';
    if (masteryRecord.accuracy < 80) return 'medium';
    return 'strong';
  }

  function getWeakTopics(topics) {
    const masteryData = StorageService.get('masteryData', {});
    return topics.filter(topic => {
      const mastery = masteryData[topic.id];
      if (!mastery || !mastery.studied) return false;
      return mastery.accuracy < 70;
    }).sort((a, b) => {
      const masteryA = masteryData[a.id];
      const masteryB = masteryData[b.id];
      return masteryA.accuracy - masteryB.accuracy;
    });
  }

  function getStrongTopics(topics) {
    const masteryData = StorageService.get('masteryData', {});
    return topics.filter(topic => {
      const mastery = masteryData[topic.id];
      if (!mastery || !mastery.studied) return false;
      return mastery.accuracy >= 80;
    }).sort((a, b) => {
      const masteryA = masteryData[a.id];
      const masteryB = masteryData[b.id];
      return masteryB.accuracy - masteryA.accuracy;
    });
  }

  function getRecommendedTopic(topics) {
    const masteryData = StorageService.get('masteryData', {});
    const unstudied = topics.find(t => !masteryData[t.id]?.studied);
    if (unstudied) return unstudied;
    const weak = topics.find(t => {
      const m = masteryData[t.id];
      return m && m.accuracy < 50;
    });
    if (weak) return weak;
    const medium = topics.find(t => {
      const m = masteryData[t.id];
      return m && m.accuracy >= 50 && m.accuracy < 80;
    });
    return medium || topics[0];
  }

  function getStudyStats(topics) {
    const masteryData = StorageService.get('masteryData', {});
    const studied = topics.filter(t => masteryData[t.id]?.studied).length;
    const strong = topics.filter(t => {
      const m = masteryData[t.id];
      return m && m.accuracy >= 80;
    }).length;
    const weak = getWeakTopics(topics).length;
    const totalQuizzes = Object.values(masteryData).reduce((sum, m) => sum + m.quizAttempts.length, 0);
    const studiedWithScore = topics.filter(t => masteryData[t.id]?.studied && masteryData[t.id]?.accuracy > 0);
    const avgAccuracy = studiedWithScore.length === 0 ? 0 :
      Math.round(studiedWithScore.reduce((acc, t) => acc + masteryData[t.id].accuracy, 0) / studiedWithScore.length);

    return {
      total: topics.length,
      studied,
      strong,
      weak,
      remaining: topics.length - studied,
      averageAccuracy: avgAccuracy,
      totalQuizzes
    };
  }

  function getStudyStreak() {
    const masteryData = StorageService.get('masteryData', {});
    const dates = [];
    Object.values(masteryData).forEach(m => {
      dates.push(...m.studiedDates);
    });
    if (dates.length === 0) return 0;
    dates.sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    for (const dateStr of dates) {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      const dayDiff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
      if (dayDiff === streak) {
        streak++;
        currentDate = new Date(date);
      } else if (dayDiff > streak) {
        break;
      }
    }
    return streak;
  }

  return {
    getTopicMastery, recordStudySession, recordQuizAttempt, getMasteryLevel,
    getWeakTopics, getStrongTopics, getRecommendedTopic, getStudyStats, getStudyStreak
  };
})();

// ──────────────────────────────────────────────────────────
// UI NOTIFICATIONS
// ──────────────────────────────────────────────────────────
const UINotifications = (() => {
  function toast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function showLoading(msg = 'Processing…') {
    document.getElementById('loading-msg').textContent = msg;
    document.getElementById('loading').classList.remove('hidden');
  }

  function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
  }

  return { toast, showLoading, hideLoading };
})();

// ──────────────────────────────────────────────────────────
// QUIZ ENGINE MODULE
// ──────────────────────────────────────────────────────────
const QuizEngine = (() => {
  let currentQuiz = null;
  let quizAnswers = {};
  let quizDone = false;

  function recordQuizResult(score, total, topicId = null) {
    const result = {
      id: Date.now().toString(),
      score,
      total,
      accuracy: Math.round((score / total) * 100),
      topicId: topicId || 'mixed',
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-IN')
    };
    StorageService.addToArray('quizResults', result);
    if (topicId) {
      MasteryEngine.recordQuizAttempt(topicId, score, total);
    }
    return result;
  }

  function getRecentResults(limit = 10) {
    return StorageService.get('quizResults', []).slice(0, limit);
  }

  function getAverageAccuracy() {
    const results = StorageService.get('quizResults', []);
    if (results.length === 0) return 0;
    const sum = results.reduce((acc, r) => acc + r.accuracy, 0);
    return Math.round(sum / results.length);
  }

  return {
    recordQuizResult, getRecentResults, getAverageAccuracy,
    setQuiz: (q) => { currentQuiz = q; quizAnswers = {}; quizDone = false; },
    getQuiz: () => currentQuiz,
    setAnswers: (a) => { quizAnswers = a; },
    getAnswers: () => quizAnswers,
    setDone: (d) => { quizDone = d; },
    isDone: () => quizDone
  };
})();

// ──────────────────────────────────────────────────────────
// NOTES MODULE
// ──────────────────────────────────────────────────────────
const NotesModule = (() => {
  function createNote(title, body, topicId = 'General', topicName = 'General') {
    return {
      id: Date.now().toString(),
      title: title || 'Note ' + new Date().toLocaleDateString(),
      body,
      topicId,
      topicName,
      date: new Date().toLocaleDateString('en-IN'),
      updatedAt: new Date().toISOString()
    };
  }

  function saveNote(note) {
    return StorageService.addToArray('notes', note);
  }

  function updateNote(noteId, updates) {
    return StorageService.updateInArray('notes', noteId, updates);
  }

  function deleteNote(noteId) {
    return StorageService.removeFromArray('notes', noteId);
  }

  function getNotes() {
    return StorageService.get('notes', []);
  }

  function getNotesByTopic(topicId) {
    const notes = getNotes();
    return notes.filter(n => n.topicId === topicId);
  }

  function searchNotes(query) {
    const notes = getNotes();
    const q = query.toLowerCase();
    return notes.filter(n => 
      n.title.toLowerCase().includes(q) ||
      n.body.toLowerCase().includes(q)
    );
  }

  return {
    createNote, saveNote, updateNote, deleteNote, getNotes, getNotesByTopic, searchNotes
  };
})();

// ──────────────────────────────────────────────────────────
// NAVIGATION & STATE
// ──────────────────────────────────────────────────────────
const AppState = (() => {
  let state = {
    currentPage: 'dashboard',
    currentTopic: null,
    studyMode: 'deep',
    theme: StorageService.get('user_theme', 'light'),
    notesPanelOpen: true
  };

  return {
    get: (key) => state[key],
    set: (key, value) => { state[key] = value; },
    getAll: () => ({ ...state })
  };
})();

// ──────────────────────────────────────────────────────────
// MAIN INIT
// ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  console.log('✓ PsychStudy 2.0 initializing...');
  
  // Load theme
  const theme = StorageService.get('user_theme', 'light');
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeBtn').textContent = theme === 'dark' ? '☀️' : '🌙';
  
  // Initialize UI
  initTopicGrid();
  updateStatsBar();
  initDailyFact();
  
  // Load PDF.js
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  script.onload = () => {
    if (window.pdfjsLib) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  };
  document.head.appendChild(script);

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
  });

  console.log('✓ App initialized successfully');
});

// ──────────────────────────────────────────────────────────
// HELPER FUNCTIONS (From original KB - to be imported)
// ──────────────────────────────────────────────────────────
// Note: Full KB with all 22 topics would be imported here
// For now, using placeholder that references original KB

// These will be called throughout the app
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('pg-' + page);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  AppState.set('currentPage', page);
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleTheme() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = dark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  document.getElementById('themeBtn').textContent = dark ? '🌙' : '☀️';
  StorageService.set('user_theme', newTheme);
}

function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

function updateStatsBar() {
  const notes = NotesModule.getNotes();
  const studied = Object.keys(StorageService.get('masteryData', {})).length;
  const quizzes = StorageService.get('quizResults', []).length;
  document.getElementById('s-topics').textContent = KB.length;
  document.getElementById('s-notes').textContent = notes.length;
  document.getElementById('s-studied').textContent = studied;
  document.getElementById('s-quizzes').textContent = quizzes;
}

function initTopicGrid() {
  const categories = [...new Set(KB.map(t => t.category))];
  const pillsEl = document.getElementById('filterPills');
  if (pillsEl) {
    pillsEl.innerHTML = `<button class="filter-pill active" onclick="filterTopics('All',this)">All</button>`
      + categories.map(c => `<button class="filter-pill" onclick="filterTopics('${c}',this)">${c}</button>`).join('');
  }
  renderTopicGrid(KB);
}

const CAT_COLOR = {
  'Foundations': { bg: 'var(--lav-light)', color: 'var(--lav)' },
  'Anxiety Disorders': { bg: 'var(--blue-light)', color: 'var(--blue)' },
  'Mood Disorders': { bg: 'var(--amber-light)', color: 'var(--amber)' },
  'Eating Disorders': { bg: 'var(--mint-light)', color: 'var(--mint)' },
  'Personality Disorders': { bg: 'var(--pink-light)', color: 'var(--pink)' },
  'Psychotic Disorders': { bg: 'rgba(139,92,246,.12)', color: 'var(--violet)' },
};

function catStyle(cat) {
  return CAT_COLOR[cat] || { bg: 'var(--lav-light)', color: 'var(--lav)' };
}

function filterTopics(cat, btn) {
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderTopicGrid(cat === 'All' ? KB : KB.filter(t => t.category === cat));
}

function renderTopicGrid(topics) {
  const grid = document.getElementById('topicsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const masteryData = StorageService.get('masteryData', {});
  topics.forEach((topic, i) => {
    const st = catStyle(topic.category);
    const mastery = masteryData[topic.id];
    const studied = mastery && mastery.studied;
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.style.animationDelay = (i * 0.04) + 's';
    const progWidth = studied ? Math.round(mastery.accuracy) : 0;
    card.innerHTML = `
      <div class="tc-top">
        <span class="tc-icon">${topic.icon}</span>
        <span class="tc-badge" style="background:${st.bg};color:${st.color}">${topic.category}</span>
      </div>
      <div class="tc-progress"><div class="tc-progress-fill" style="width:${progWidth}%"></div></div>
      <div class="tc-name">${topic.name}</div>
      <div class="tc-preview">${topic.preview}</div>
      <div class="tc-actions">
        <button class="btn btn-primary" onclick="openStudyTopic('${topic.id}')">📖 Study</button>
        <button class="btn btn-ghost" onclick="openFlashcardsTopic('${topic.id}')">🃏 Cards</button>
      </div>`;
    grid.appendChild(card);
  });
}

function initDailyFact() {
  const DAILY_FACTS = [
    { title: 'The Four Ds', text: 'Psychologists use four criteria to define abnormal behaviour: Distress, Dysfunction, Deviance, and Danger. All four together help clinicians avoid labelling unusual but harmless behaviour as a disorder.' },
    { title: 'OCD Cycle', text: 'In OCD, compulsions temporarily relieve the anxiety caused by obsessions — but that relief reinforces the cycle. Exposure and Response Prevention (ERP) therapy breaks this cycle by preventing the compulsion while tolerating the anxiety.' },
    { title: 'Bipolar & Lithium', text: 'Lithium — a naturally occurring salt — remains one of the most effective mood stabilisers for bipolar disorder, used since the 1940s. It reduces both manic and depressive episodes and lowers suicide risk by up to 80%.' },
    { title: 'GAD vs Normal Worry', text: 'Everyone worries, but people with GAD cannot "turn off" their worry. The key difference: normal worry is temporary and linked to real threats. GAD involves uncontrollable worry about multiple areas for ≥6 months.' }
  ];
  const idx = new Date().getDate() % DAILY_FACTS.length;
  const f = DAILY_FACTS[idx];
  const titleEl = document.getElementById('factTitle');
  const textEl = document.getElementById('factText');
  if (titleEl) titleEl.textContent = f.title;
  if (textEl) textEl.textContent = f.text;
}

// Placeholder for functions that need KB - will be populated from original script
async function importPDF(event) {
  const file = event.target.files[0];
  if (!file || !file.name.endsWith('.pdf')) {
    UINotifications.toast('Please select a PDF file.', 'error');
    return;
  }
  UINotifications.showLoading('📄 Reading PDF…');
  try {
    if (!window.pdfjsLib) {
      UINotifications.hideLoading();
      UINotifications.toast('PDF.js not loaded. Please check your internet connection.', 'error');
      return;
    }
    const ab = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const pg = await pdf.getPage(i);
      const ct = await pg.getTextContent();
      text += ct.items.map(x => x.str).join(' ') + '\n';
    }
    UINotifications.hideLoading();
    const wordCount = text.trim().split(/\s+/).length;
    UINotifications.toast(`✅ PDF imported! Extracted ~${wordCount.toLocaleString()} words.`, 'success', 5000);
    const stored = StorageService.get('importedPDFs', []);
    stored.push({ name: file.name, text: text.slice(0, 5000), date: new Date().toLocaleDateString('en-IN') });
    StorageService.set('importedPDFs', stored);
    event.target.value = '';
  } catch (err) {
    UINotifications.hideLoading();
    UINotifications.toast('Error reading PDF: ' + err.message, 'error');
    event.target.value = '';
  }
}

// Additional placeholder functions
function openStudyTopic(id) { console.log('Study topic:', id); navigate('study'); }
function openFlashcardsTopic(id) { console.log('Flashcard topic:', id); navigate('flashcards'); }
function loadStudyTopic(idx) { console.log('Load study topic:', idx); }
function changeStudyTopic(dir) { console.log('Change study topic:', dir); }

// Export for global access
window.navigate = navigate;
window.toggleTheme = toggleTheme;
window.toggleNav = toggleNav;
window.filterTopics = filterTopics;
window.openStudyTopic = openStudyTopic;
window.openFlashcardsTopic = openFlashcardsTopic;
window.loadStudyTopic = loadStudyTopic;
window.changeStudyTopic = changeStudyTopic;
window.importPDF = importPDF;

// Expose modules for testing/extension
window.StorageService = StorageService;
window.MasteryEngine = MasteryEngine;
window.NotesModule = NotesModule;
window.QuizEngine = QuizEngine;
