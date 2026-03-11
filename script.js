/* ═══════════════════════════════════════════════════════════
   PSYCHSTUDY AI — script.js
   Full Vanilla JS: navigation, file upload, AI integration,
   study modes, flashcards, quiz, exam paper
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── APP STATE ─────────────────────────────────────────────
const APP = {
  isDark:       false,
  docText:      '',
  topics:       [],
  currentTopic: null,
  studyContent: null,
  studyMode:    'deep',
  flashcards:   [],
  cardIdx:      0,
  isFlipped:    false,
  quiz:         null,
  quizAnswers:  {},
  quizSubmitted:false,
  exam:         null,
  showAnswers:  false,
};

// ── API HELPER ────────────────────────────────────────────
async function callClaude(userPrompt, system = '') {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: system || 'You are an expert psychology professor specialising in the Indian university curriculum. Respond ONLY with valid JSON — no markdown, no preamble, no text outside the JSON object.',
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  const data = await res.json();
  return data.content.map(b => b.text || '').join('').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}

// ── LOADING ───────────────────────────────────────────────
function showLoading(msg = 'Processing…') {
  document.getElementById('loading-msg').textContent = msg;
  document.getElementById('loading-overlay').classList.remove('hidden');
}
function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

// ── NAVIGATION ────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) { page.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

function scrollToUpload() {
  showPage('home');
  setTimeout(() => document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' }), 100);
}

function triggerQuiz() {
  if (!APP.topics.length) { alert('Please upload a document or try the demo first.'); return; }
  openQuiz();
}
function triggerExam() {
  if (!APP.topics.length) { alert('Please upload a document or try the demo first.'); return; }
  openExam();
}

// ── THEME ─────────────────────────────────────────────────
function toggleTheme() {
  APP.isDark = !APP.isDark;
  document.documentElement.setAttribute('data-theme', APP.isDark ? 'dark' : 'light');
  document.getElementById('theme-btn').textContent = APP.isDark ? '☀️' : '🌙';
}

// ── DEMO DATA ─────────────────────────────────────────────
const DEMO_TEXT = `Psychology of Adjustment — Question Bank
FILL IN THE BLANKS:
1. Fear of social situations is called social phobia.
2. Extreme mood swings occur in bipolar disorder.
3. Hearing voices not present is called hallucination.
4. False beliefs not based in reality are called delusions.
5. The act of intentionally causing one's own death is called suicide.
6. Seasonal depression is called seasonal affective disorder.
7. Insight therapy focuses on developing self-awareness.
8. Free association is a technique used in psychoanalysis.
9. CBT stands for Cognitive Behavioral Therapy.
10. Repetitive behaviors to reduce anxiety are called compulsions.
11. The psychoanalytic approach was developed by Sigmund Freud.
12. Electroconvulsive Therapy is abbreviated as ECT.
13. A severe eating disorder involving weight loss is anorexia nervosa.
14. The DSM is published by the American Psychiatric Association.
15. Projection of feelings onto therapist is called transference.
16. Persistent sadness is characteristic of depressive disorder.
17. A disorder involving hallucinations and delusions is schizophrenia.
18. Chronic mild depression lasting 2 years is called dysthymia.
19. Sudden intense fear episodes are called panic attacks.
20. Negative attitudes toward mental illness are known as stigma.
LONG ANSWER TOPICS:
- Definitions of mental illness across time and cultures; cultural-bound syndromes
- Major anxiety disorders: GAD, OCD symptoms
- Gender differences in help-seeking behavior
- Behavior therapy and token economy
- Person-Centered Therapy (Carl Rogers)
- Cultural issues in mental health care
- Psychoanalysis and its techniques
- Eating disorders: anorexia nervosa, bulimia, binge eating
- Personality disorders: antisocial, borderline
- Reasons for reluctance in seeking professional help
- Group therapy; relationship counselling; alternative therapies
- Psychological disorders: four criteria of abnormality
- Suicide: causes, warning signs, and prevention`;

const FALLBACK_TOPICS = [
  { name:'Social Phobia',                     category:'Anxiety Disorders' },
  { name:'Generalised Anxiety Disorder (GAD)', category:'Anxiety Disorders' },
  { name:'OCD',                               category:'Anxiety Disorders' },
  { name:'Panic Disorder',                    category:'Anxiety Disorders' },
  { name:'Bipolar Disorder',                  category:'Mood Disorders' },
  { name:'Major Depressive Disorder',         category:'Mood Disorders' },
  { name:'Seasonal Affective Disorder',       category:'Mood Disorders' },
  { name:'Schizophrenia',                     category:'Psychotic Disorders' },
  { name:'Psychoanalysis',                    category:'Therapies' },
  { name:'Cognitive Behavioural Therapy (CBT)',category:'Therapies' },
  { name:'Person-Centered Therapy',           category:'Therapies' },
  { name:'Behavior Therapy & Token Economy',  category:'Therapies' },
  { name:'Group Therapy',                     category:'Therapies' },
  { name:'Anorexia Nervosa',                  category:'Eating Disorders' },
  { name:'Bulimia Nervosa',                   category:'Eating Disorders' },
  { name:'Binge Eating Disorder',             category:'Eating Disorders' },
  { name:'Antisocial Personality Disorder',   category:'Personality Disorders' },
  { name:'Borderline Personality Disorder',   category:'Personality Disorders' },
  { name:'Suicide: Causes & Prevention',      category:'Key Concepts' },
  { name:'Four Criteria of Abnormality',      category:'Key Concepts' },
  { name:'Cultural Bound Syndromes',          category:'Key Concepts' },
  { name:'Stigma in Mental Health',           category:'Key Concepts' },
];

const CAT_META = {
  'Anxiety Disorders':     { icon:'😰', color:'#4E9AF1', bg:'#DBEAFE' },
  'Mood Disorders':        { icon:'😢', color:'#F59E0B', bg:'#FEF3C7' },
  'Psychotic Disorders':   { icon:'🌀', color:'#EC4899', bg:'#FCE7F3' },
  'Therapies':             { icon:'💆', color:'#34D399', bg:'#D1FAE5' },
  'Eating Disorders':      { icon:'🍃', color:'#EA580C', bg:'#FFEDD5' },
  'Personality Disorders': { icon:'🎭', color:'#8B5CF6', bg:'#EDE9FE' },
  'Key Concepts':          { icon:'💡', color:'#7C6BE8', bg:'#EDE9FF' },
};
function cm(cat) { return CAT_META[cat] || { icon:'🧠', color:'#7C6BE8', bg:'#EDE9FF' }; }

// ── DAILY FACTS ───────────────────────────────────────────
const DAILY_FACTS = [
  { title:'The Placebo Effect', text:'A sugar pill can reduce pain by up to 30% simply because the patient believes it is effective medicine — the brain\'s expectation shapes physiological reality.' },
  { title:'Forgetting Curve', text:'Hermann Ebbinghaus found we forget 50% of new information within an hour. Spaced repetition dramatically flattens this curve — review this deck daily!' },
  { title:'Cognitive Dissonance', text:'Leon Festinger showed that holding two conflicting beliefs creates mental discomfort, leading people to rationalise or change their behaviour to restore harmony.' },
  { title:'Maslow\'s Hierarchy', text:'Abraham Maslow proposed five levels of human needs from physiological survival to self-actualisation — only 1% of people are estimated to reach the top level.' },
  { title:'Mirror Neurons', text:'Discovered in macaque monkeys, mirror neurons fire both when we perform an action AND when we observe someone else doing it — the neural basis of empathy.' },
  { title:'Stanford Prison Experiment', text:'Philip Zimbardo\'s 1971 study showed ordinary college students could take on brutal guard behaviour within days, demonstrating the power of social roles over character.' },
  { title:'Bystander Effect', text:'Kitty Genovese\'s case inspired Darley & Latané to show: the more witnesses present, the less likely any individual will help in an emergency — diffusion of responsibility.' },
  { title:'Classical Conditioning', text:'Pavlov\'s dogs learned to salivate at the sound of a bell. This same associative learning mechanism underlies many phobias and anxiety disorders treated in therapy.' },
  { title:'Growth Mindset', text:'Carol Dweck\'s research shows students who believe intelligence is malleable outperform peers who see it as fixed — relevant to how you approach this exam!' },
  { title:'Confirmation Bias', text:'We naturally seek information that confirms what we already believe. This cognitive shortcut is behind polarisation, misinformation spread, and flawed clinical reasoning.' },
];

function initDailyFact() {
  const idx = new Date().getDate() % DAILY_FACTS.length;
  const fact = DAILY_FACTS[idx];
  document.getElementById('fact-heading').textContent = fact.title;
  document.getElementById('fact-text').textContent    = fact.text;
}

// ── FILE UPLOAD ───────────────────────────────────────────
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('upload-zone').classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
}
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}

async function processFile(file) {
  showLoading('📄 Reading your document…');
  try {
    const text = await extractText(file);
    await processDocument(text);
  } catch (err) {
    console.error(err);
    hideLoading();
    alert('Could not read the file. Loading demo document instead.');
    loadDemo();
  }
}

async function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'txt') {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload  = e => res(e.target.result);
      r.onerror = rej;
      r.readAsText(file);
    });
  }

  if (ext === 'docx') {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = async e => {
        try {
          const out = await mammoth.extractRawText({ arrayBuffer: e.target.result });
          res(out.value);
        } catch (err) { rej(err); }
      };
      r.onerror = rej;
      r.readAsArrayBuffer(file);
    });
  }

  if (ext === 'pdf') {
    return new Promise((res, rej) => {
      if (!window.pdfjsLib) { rej(new Error('PDF.js not loaded')); return; }
      const r = new FileReader();
      r.onload = async e => {
        try {
          const pdf = await pdfjsLib.getDocument({ data: e.target.result }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page    = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(x => x.str).join(' ') + '\n';
          }
          res(text);
        } catch (err) { rej(err); }
      };
      r.onerror = rej;
      r.readAsArrayBuffer(file);
    });
  }
  throw new Error('Unsupported file type');
}

async function loadDemo() {
  showLoading('✨ Loading demo question bank…');
  await processDocument(DEMO_TEXT);
}

async function processDocument(text) {
  APP.docText = text;
  showLoading('🧠 Extracting psychology topics…');
  try {
    const raw = await callClaude(
      `Extract all psychology topics, concepts, disorders, and theories from this text.
Return JSON: {"topics":[{"name":"Topic Name","category":"Category"}]}
Use only these categories: Anxiety Disorders, Mood Disorders, Psychotic Disorders, Therapies, Eating Disorders, Personality Disorders, Key Concepts
Document:\n${text.slice(0, 3500)}`
    );
    const parsed = JSON.parse(raw);
    APP.topics = parsed.topics?.length ? parsed.topics : FALLBACK_TOPICS;
  } catch {
    APP.topics = FALLBACK_TOPICS;
  }

  hideLoading();
  showNavItems();
  updateStats();
  renderTopics(APP.topics);
  showPage('dashboard');
}

function showNavItems() {
  ['nav-topics','nav-quiz','nav-exam','nav-flashcards'].forEach(id => {
    document.getElementById(id)?.classList.remove('hidden');
  });
}

function updateStats() {
  const cats = [...new Set(APP.topics.map(t => t.category))];
  document.getElementById('stat-topics').textContent = APP.topics.length;
  document.getElementById('stat-cats').textContent   = cats.length;
  document.getElementById('stats-section').classList.remove('hidden');
}

// ── TOPIC GRID ────────────────────────────────────────────
function renderTopics(topics) {
  const grid = document.getElementById('topic-grid');
  grid.innerHTML = '';
  topics.forEach((topic, i) => {
    const meta = cm(topic.category);
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.style.animationDelay = (i * 0.04) + 's';
    card.innerHTML = `
      <div class="tc-top">
        <span class="tc-icon">${meta.icon}</span>
        <span class="tc-badge" style="background:${meta.bg};color:${meta.color}">${topic.category}</span>
      </div>
      <div class="tc-name">${topic.name}</div>
      <div class="tc-actions">
        <button class="btn btn-primary" onclick="openStudy(${i})">📖 Study</button>
        <button class="btn btn-ghost" onclick="openFlashcards(${i})" title="Flashcards">🃏</button>
      </div>`;
    grid.appendChild(card);
  });
  renderCategoryPills();
}

function renderCategoryPills() {
  const container = document.getElementById('cat-pills');
  const cats = [...new Set(APP.topics.map(t => t.category))];
  container.innerHTML = `<button class="pill active" onclick="filterCat('All',this)">All</button>`;
  cats.forEach(cat => {
    const meta = cm(cat);
    const btn = document.createElement('button');
    btn.className = 'pill';
    btn.textContent = meta.icon + ' ' + cat;
    btn.onclick = function() { filterCat(cat, this); };
    container.appendChild(btn);
  });
}

function filterCat(cat, btn) {
  document.querySelectorAll('.cat-pills .pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const filtered = cat === 'All' ? APP.topics : APP.topics.filter(t => t.category === cat);
  renderTopics(filtered);
  // Re-add pills without overwriting
  renderCategoryPills();
  // Re-mark active pill
  document.querySelectorAll('.cat-pills .pill').forEach(p => {
    if (p.textContent.includes(cat) || (cat === 'All' && p.textContent === 'All')) {
      p.classList.add('active');
    }
  });
}

// ── STUDY PAGE ────────────────────────────────────────────
async function openStudy(idx) {
  const topic = APP.topics[idx];
  if (!topic) return;
  APP.currentTopic  = topic;
  APP.studyContent  = null;
  APP.studyMode     = 'deep';

  renderStudyBanner(topic);
  document.getElementById('study-body').innerHTML = '<div style="text-align:center;padding:60px 0;color:var(--text-2);"><span style="font-size:48px" class="loading-brain">📚</span><br><br>Generating study material…</div>';

  // Reset mode tabs
  document.getElementById('tab-deep').classList.add('active');
  document.getElementById('tab-quick').classList.remove('active');

  showPage('study');
  showLoading(`📚 Generating notes for "${topic.name}"…`);

  try {
    const raw = await callClaude(`Generate comprehensive Indian-university-style study material for the psychology topic: "${topic.name}" (category: ${topic.category}).
Return only this JSON with all fields populated:
{
  "definition": "2-3 clear sentences",
  "explanation": "4-5 paragraphs separated by \\n\\n for a 15-mark exam answer",
  "keyPoints": ["point 1","point 2","point 3","point 4","point 5"],
  "types": ["Type — description","..."],
  "symptoms": ["symptom 1","symptom 2","..."],
  "psychologists": ["Name — contribution","..."],
  "examples": ["example 1","example 2"],
  "treatment": "2-3 sentences on treatment approaches",
  "summary": "3-sentence exam-ready summary",
  "mnemonic": "A memory trick or acronym if applicable"
}`);
    APP.studyContent = JSON.parse(raw);
  } catch {
    APP.studyContent = makeFallbackStudy(topic);
  }

  hideLoading();
  renderStudyBody();
}

function makeFallbackStudy(topic) {
  return {
    definition: `${topic.name} is a key concept in ${topic.category} studied in the psychology of adjustment curriculum.`,
    explanation: `${topic.name} is an important area within ${topic.category}.\n\nIt involves understanding core features, diagnostic criteria, and psychosocial implications that affect individuals in society.\n\nIndian university examinations frequently test on definitions, types, causes, and treatment approaches for ${topic.name}.\n\nResearchers and clinical psychologists have developed multiple frameworks to understand and treat this condition effectively.\n\nCultural factors also play an important role in how ${topic.name} is expressed, recognised, and addressed in the Indian context.`,
    keyPoints: ['Core diagnostic feature and definition','Epidemiology and prevalence','Biological, psychological, and social causes','DSM-5 diagnostic criteria','Evidence-based treatment approaches'],
    types: ['Primary presentation — classic form','Secondary variation — co-morbid presentation'],
    symptoms: ['Primary symptom characteristic','Associated cognitive feature','Behavioural manifestation','Physiological component'],
    psychologists: ['Key researcher — foundational contribution','Clinical pioneer — treatment development'],
    examples: ['Clinical case example — presentations in practice','Real-world scenario relevant to Indian students'],
    treatment: 'Psychotherapy (cognitive-behavioural and insight-oriented approaches) combined with pharmacological interventions form the standard evidence-based treatment. Cultural sensitivity is important in the Indian context.',
    summary: `${topic.name} is a significant psychological concept within ${topic.category}. It is characterised by specific diagnostic criteria, has identifiable causes, and responds to evidence-based treatments. For Indian university exams, focus on definitions, types, symptoms, and therapeutic interventions.`,
    mnemonic: 'Create a personal mnemonic linking the first letters of key symptoms.',
  };
}

function renderStudyBanner(topic) {
  const meta = cm(topic.category);
  document.getElementById('study-banner').innerHTML = `
    <div class="sb-top">
      <span class="sb-icon">${meta.icon}</span>
      <div>
        <span class="tc-badge" style="background:${meta.bg};color:${meta.color}">${topic.category}</span>
        <h1 class="sb-h1">${topic.name}</h1>
      </div>
    </div>`;
}

function setMode(mode) {
  APP.studyMode = mode;
  document.getElementById('tab-deep').classList.toggle('active', mode === 'deep');
  document.getElementById('tab-quick').classList.toggle('active', mode === 'quick');
  renderStudyBody();
}

function renderStudyBody() {
  const c = APP.studyContent;
  if (!c) return;
  const body = document.getElementById('study-body');
  const meta = cm(APP.currentTopic.category);

  if (APP.studyMode === 'deep') {
    body.innerHTML = `
      <!-- Definition -->
      <div class="s-card" style="animation-delay:.0s">
        <div class="s-card-title" style="color:var(--lav)">📌 Definition</div>
        <p>${c.definition}</p>
      </div>

      <!-- Explanation -->
      <div class="s-card" style="animation-delay:.05s">
        <div class="s-card-title" style="color:var(--blue)">📖 Detailed Explanation <small style="color:var(--text-2);font-weight:400">(Exam Answer Level)</small></div>
        ${c.explanation.split('\n\n').map(p => `<p>${p}</p>`).join('')}
      </div>

      <!-- Types & Symptoms grid -->
      <div class="s-grid-2">
        ${c.types?.length ? `<div class="s-card" style="animation-delay:.1s">
          <div class="s-card-title" style="color:var(--mint)">🔀 Types / Subtypes</div>
          <ul class="tagged-list">${c.types.map(t => `<li class="tagged-item" style="background:var(--mint-light);color:#065F46;border-color:rgba(52,211,153,.35)">${t}</li>`).join('')}</ul>
        </div>` : ''}
        ${c.symptoms?.length ? `<div class="s-card" style="animation-delay:.12s">
          <div class="s-card-title" style="color:var(--amber)">🔍 Symptoms / Features</div>
          <ul class="tagged-list">${c.symptoms.map(s => `<li class="tagged-item" style="background:var(--amber-light);color:#92400E;border-color:rgba(245,158,11,.35)">${s}</li>`).join('')}</ul>
        </div>` : ''}
      </div>

      <!-- Key Points -->
      <div class="s-card" style="animation-delay:.15s">
        <div class="s-card-title" style="color:var(--violet)">🔑 Key Exam Points</div>
        <div class="key-points">
          ${c.keyPoints.map((kp, i) => `
            <div class="kp-item">
              <span class="kp-num">${i+1}</span>
              <span class="kp-text">${kp}</span>
            </div>`).join('')}
        </div>
      </div>

      <!-- Psychologists & Examples -->
      <div class="s-grid-2">
        ${c.psychologists?.length ? `<div class="s-card" style="animation-delay:.2s">
          <div class="s-card-title" style="color:var(--pink)">👨‍🔬 Key Psychologists</div>
          <ul class="tagged-list">${c.psychologists.map(p => `<li class="tagged-item" style="background:var(--pink-light);color:#831843;border-color:rgba(236,72,153,.3)">${p}</li>`).join('')}</ul>
        </div>` : ''}
        ${c.examples?.length ? `<div class="s-card" style="animation-delay:.22s">
          <div class="s-card-title" style="color:var(--amber)">💡 Real-World Examples</div>
          <ul class="tagged-list">${c.examples.map(ex => `<li class="tagged-item" style="background:var(--amber-light);color:#78350F;border-color:rgba(245,158,11,.3)">${ex}</li>`).join('')}</ul>
        </div>` : ''}
      </div>

      <!-- Treatment -->
      ${c.treatment ? `<div class="s-card" style="animation-delay:.25s">
        <div class="s-card-title" style="color:#10B981">💊 Treatment Approaches</div>
        <p>${c.treatment}</p>
      </div>` : ''}

      <!-- Summary + Mnemonic -->
      <div class="s-card summary-card" style="animation-delay:.28s">
        <div class="s-card-title" style="color:var(--lav)">📝 Exam-Ready Summary</div>
        <p style="font-size:15.5px;font-weight:500">${c.summary}</p>
        ${c.mnemonic ? `<div class="mnemonic-box"><strong>🧩 Memory Trick: </strong><span>${c.mnemonic}</span></div>` : ''}
      </div>`;
  } else {
    // Quick Revision
    body.innerHTML = `
      <div class="qr-definition">
        <div class="label">⚡ ONE-LINE DEFINITION</div>
        <p>${c.definition}</p>
      </div>
      <div class="s-card">
        <div class="s-card-title">🔑 Key Points at a Glance</div>
        <div class="kp-grid">${c.keyPoints.map(kp => `<div class="kp-chip">${kp}</div>`).join('')}</div>
      </div>
      <div class="s-card summary-card">
        <div class="s-card-title" style="color:var(--lav)">📝 Exam Summary</div>
        <p style="font-size:15px;font-weight:500">${c.summary}</p>
        ${c.mnemonic ? `<div class="mnemonic-box" style="margin-top:14px"><strong>🧩 </strong><span>${c.mnemonic}</span></div>` : ''}
      </div>
      ${c.psychologists?.length ? `<div class="s-card">
        <div class="s-card-title" style="color:var(--pink)">👨‍🔬 Key Names to Remember</div>
        <ul class="tagged-list">${c.psychologists.map(p => `<li class="tagged-item" style="background:var(--pink-light);color:#831843;border-color:rgba(236,72,153,.3)">${p}</li>`).join('')}</ul>
      </div>` : ''}`;
  }
}

function openFlashcardsFromStudy() {
  const idx = APP.topics.indexOf(APP.currentTopic);
  if (idx >= 0) openFlashcards(idx);
}

// ── FLASHCARDS ────────────────────────────────────────────
async function openFlashcards(idx) {
  const topic = APP.topics[idx];
  if (!topic) return;
  APP.currentTopic = topic;
  APP.flashcards   = [];
  APP.cardIdx      = 0;
  APP.isFlipped    = false;

  const meta = cm(topic.category);
  document.getElementById('fc-header').innerHTML = `
    <h2>${topic.name}</h2>
    <p class="fc-counter">Tap the card to flip it</p>`;

  document.getElementById('fc-stage').innerHTML = '<div style="text-align:center;padding:80px 0;color:var(--text-2)">🃏 Generating flashcards…</div>';
  document.getElementById('fc-controls').innerHTML = '';

  showPage('flashcards');
  showLoading('🃏 Creating flashcards…');

  try {
    const raw = await callClaude(`Create 8 flashcards for the psychology topic "${topic.name}". Each card should help Indian university students memorise key facts.
Return JSON: {"flashcards":[{"front":"Question or term","back":"Answer or definition","tag":"Definition|Theory|Application|Psychologist"}]}`);
    APP.flashcards = JSON.parse(raw).flashcards || [];
  } catch {
    APP.flashcards = [
      { front:`Define: ${topic.name}`, back:`A core concept in ${topic.category} — review your study notes for a complete definition.`, tag:'Definition' },
      { front:`What are the main features of ${topic.name}?`, back:'Review symptoms, diagnostic criteria, and behavioural manifestations in your textbook.', tag:'Application' },
      { front:`Who are the key researchers associated with ${topic.name}?`, back:'Consult your notes on foundational psychologists and their contributions to this field.', tag:'Psychologist' },
      { front:`What is the treatment approach for ${topic.name}?`, back:'Evidence-based psychotherapy and pharmacological approaches — see study notes for specifics.', tag:'Application' },
    ];
  }

  hideLoading();
  renderFlashcard();
  renderFCControls();
}

function renderFlashcard() {
  const cards = APP.flashcards;
  if (!cards.length) return;
  const card = cards[APP.cardIdx];
  const meta  = cm(APP.currentTopic.category);
  APP.isFlipped = false;

  document.getElementById('fc-header').querySelector('.fc-counter').textContent =
    `Card ${APP.cardIdx + 1} of ${cards.length} • Tap card to flip`;

  document.getElementById('fc-stage').innerHTML = `
    <div class="fc-card" id="fc-card" onclick="flipCard()">
      <div class="fc-face fc-front" style="background:${meta.bg};border-color:${meta.color}44">
        <div class="fc-q-icon">❓</div>
        <div class="fc-q-text">${card.front}</div>
        <div class="fc-hint">Click to reveal answer</div>
      </div>
      <div class="fc-face fc-back" style="background:${meta.color}">
        <div class="fc-q-icon" style="color:#fff">✅</div>
        <div class="fc-a-text">${card.back}</div>
        ${card.tag ? `<span class="fc-tag">${card.tag}</span>` : ''}
      </div>
    </div>`;

  // Dots
  const dots = APP.flashcards.map((_, i) => {
    const d = document.createElement('div');
    d.className = 'fc-dot' + (i === APP.cardIdx ? ' active' : '');
    d.onclick = () => { APP.cardIdx = i; renderFlashcard(); renderFCControls(); };
    return d;
  });
  const dotsRow = document.createElement('div');
  dotsRow.className = 'fc-dots';
  dots.forEach(d => dotsRow.appendChild(d));
  document.getElementById('fc-stage').appendChild(dotsRow);
}

function flipCard() {
  const card = document.getElementById('fc-card');
  if (!card) return;
  APP.isFlipped = !APP.isFlipped;
  card.classList.toggle('flipped', APP.isFlipped);
}

function renderFCControls() {
  document.getElementById('fc-controls').innerHTML = `
    <button class="btn btn-ghost" onclick="fcPrev()" ${APP.cardIdx === 0 ? 'disabled' : ''}>← Prev</button>
    <button class="btn btn-primary" onclick="fcNext()" ${APP.cardIdx === APP.flashcards.length-1 ? 'disabled' : ''}>Next →</button>`;
}
function fcPrev() { if (APP.cardIdx > 0) { APP.cardIdx--; renderFlashcard(); renderFCControls(); } }
function fcNext() { if (APP.cardIdx < APP.flashcards.length-1) { APP.cardIdx++; renderFlashcard(); renderFCControls(); } }

// ── QUIZ ──────────────────────────────────────────────────
async function openQuiz() {
  APP.quiz          = null;
  APP.quizAnswers   = {};
  APP.quizSubmitted = false;

  document.getElementById('quiz-sub').textContent   = 'Generating questions…';
  document.getElementById('quiz-body').innerHTML    = '';
  document.getElementById('quiz-score').classList.add('hidden');
  document.getElementById('quiz-submit').classList.add('hidden');

  showPage('quiz');
  showLoading('📝 Generating psychology quiz…');

  const names = APP.topics.slice(0, 14).map(t => t.name).join(', ');
  try {
    const raw = await callClaude(`Create a 10-question psychology quiz for Indian university students covering these topics: ${names}.
Return JSON with exactly 5 fill-in-blank and 5 MCQ:
{
  "fillBlanks":[
    {"q":"Complete sentence with _____ blank.","a":"exact answer","hint":"brief hint"},
    {"q":"...","a":"...","hint":"..."},
    {"q":"...","a":"...","hint":"..."},
    {"q":"...","a":"...","hint":"..."},
    {"q":"...","a":"...","hint":"..."}
  ],
  "mcq":[
    {"q":"Question?","opts":["A text","B text","C text","D text"],"correct":0,"exp":"Brief explanation."},
    {"q":"...","opts":["..."],"correct":1,"exp":"..."},
    {"q":"...","opts":["..."],"correct":2,"exp":"..."},
    {"q":"...","opts":["..."],"correct":1,"exp":"..."},
    {"q":"...","opts":["..."],"correct":3,"exp":"..."}
  ]
}`);
    APP.quiz = JSON.parse(raw);
  } catch {
    APP.quiz = FALLBACK_QUIZ;
  }

  hideLoading();
  renderQuiz();
}

function renderQuiz() {
  const q = APP.quiz;
  if (!q) return;
  const total = (q.fillBlanks?.length || 0) + (q.mcq?.length || 0);
  document.getElementById('quiz-sub').textContent = `${total} questions • Test your knowledge`;

  let html = `<div class="quiz-block"><div class="quiz-section-title">Section A — Fill in the Blanks</div>`;
  (q.fillBlanks || []).forEach((item, i) => {
    html += `<div class="q-item" id="q-fi-${i}">
      <div class="q-label"><b>Q${i+1}.</b> ${item.q}</div>
      <input class="q-input" id="f-inp-${i}" type="text" placeholder="Hint: ${item.hint || 'Your answer…'}" oninput="APP.quizAnswers['f'+${i}]=this.value">
      <div class="q-feedback hidden" id="f-fb-${i}"></div>
    </div>`;
  });
  html += `</div><div class="quiz-block"><div class="quiz-section-title" style="color:var(--lav)">Section B — Multiple Choice</div>`;
  (q.mcq || []).forEach((item, i) => {
    html += `<div class="mcq-item" id="q-mc-${i}">
      <div class="mcq-q"><span>Q${i+1}.</span> ${item.q}</div>
      <div class="mcq-opts">
        ${item.opts.map((opt, j) => `<button class="mcq-opt" id="mc-${i}-${j}" onclick="selectMCQ(${i},${j})"><b>${['A','B','C','D'][j]}.</b> ${opt}</button>`).join('')}
      </div>
      <div class="mcq-exp hidden" id="mc-exp-${i}">💡 ${item.exp}</div>
    </div>`;
  });
  html += `</div>`;

  document.getElementById('quiz-body').innerHTML = html;
  document.getElementById('quiz-submit').classList.remove('hidden');
}

function selectMCQ(qIdx, optIdx) {
  if (APP.quizSubmitted) return;
  APP.quizAnswers['m' + qIdx] = optIdx;
  // Visual feedback
  const item = document.getElementById(`q-mc-${qIdx}`);
  item.querySelectorAll('.mcq-opt').forEach((btn, j) => {
    btn.classList.toggle('selected', j === optIdx);
  });
}

function submitQuiz() {
  if (APP.quizSubmitted) return;
  APP.quizSubmitted = true;

  let correct = 0, total = 0;
  const q = APP.quiz;

  // Grade fill-blanks
  (q.fillBlanks || []).forEach((item, i) => {
    total++;
    const inp  = document.getElementById(`f-inp-${i}`);
    const fb   = document.getElementById(`f-fb-${i}`);
    const box  = document.getElementById(`q-fi-${i}`);
    const ans  = (APP.quizAnswers['f' + i] || '').toLowerCase().trim();
    const ok   = ans === item.a.toLowerCase().trim();
    if (ok) correct++;
    inp.disabled = true;
    box.classList.add(ok ? 'correct' : 'wrong');
    fb.classList.remove('hidden');
    fb.className = 'q-feedback ' + (ok ? 'ok' : 'no');
    fb.textContent = ok ? '✓ Correct!' : `✗ Answer: ${item.a}`;
  });

  // Grade MCQ
  (q.mcq || []).forEach((item, i) => {
    total++;
    const sel = APP.quizAnswers['m' + i];
    const ok  = sel === item.correct;
    if (ok) correct++;
    const opts = document.getElementById(`q-mc-${i}`).querySelectorAll('.mcq-opt');
    opts.forEach((btn, j) => {
      btn.disabled = true;
      if (j === item.correct) btn.classList.add('correct');
      else if (j === sel && !ok) btn.classList.add('wrong');
    });
    document.getElementById(`mc-exp-${i}`).classList.remove('hidden');
  });

  // Show score card
  const pct   = total ? Math.round((correct/total)*100) : 0;
  const emoji = pct >= 80 ? '🏆' : pct >= 55 ? '👍' : '📖';
  const msg   = pct >= 80 ? "Excellent! You're exam-ready." : pct >= 55 ? "Good effort! Review incorrect answers." : "Keep studying! Use Deep Study mode to strengthen your knowledge.";
  const sc = document.getElementById('quiz-score');
  sc.innerHTML = `
    <div class="score-trophy">${emoji}</div>
    <div class="score-num">${correct}/${total}</div>
    <div class="score-msg">${msg}</div>
    <button class="btn btn-primary" onclick="openQuiz()">Retake Quiz</button>`;
  sc.classList.remove('hidden');

  document.getElementById('quiz-submit').classList.add('hidden');
  sc.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── EXAM PAPER ────────────────────────────────────────────
async function openExam() {
  APP.exam        = null;
  APP.showAnswers = false;
  document.getElementById('exam-paper').innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-2)">📋 Generating exam paper…</div>';
  document.getElementById('ans-btn').textContent  = '✅ Show Answers';

  showPage('exam');
  showLoading('📋 Generating exam paper (Indian University Pattern)…');

  const names = APP.topics.map(t => t.name).join(', ');
  try {
    const raw = await callClaude(`Generate a complete Indian university psychology exam paper.
Total marks: 45. Use these topics: ${names}.
Return JSON:
{
  "subject":"Psychology of Adjustment",
  "time":"3 Hours",
  "total":45,
  "q1":{"label":"Fill in the Blanks","marks":15,"items":[
    {"q":"Sentence with _____.","a":"answer"},
    {"q":"...","a":"..."},
    {"q":"...","a":"..."},
    {"q":"...","a":"..."},
    {"q":"...","a":"..."},
    {"q":"...","a":"..."},
    {"q":"...","a":"..."},
    {"q":"...","a":"..."},
    {"q":"...","a":"..."},
    {"q":"...","a":"..."}
  ]},
  "q2":{"marks":15,"A":"Long answer question A text","B":"Long answer question B text","hints":["key point 1","key point 2","key point 3","key point 4"]},
  "q3":{"marks":15,"A":"Long answer question A text","B":"Long answer question B text","hints":["key point 1","key point 2","key point 3"]},
  "q4":{"marks":15,"topics":[
    {"t":"Short note topic 1","pts":["point 1","point 2","point 3"]},
    {"t":"Short note topic 2","pts":["point 1","point 2"]},
    {"t":"Short note topic 3","pts":["point 1","point 2"]},
    {"t":"Short note topic 4","pts":["point 1","point 2"]},
    {"t":"Short note topic 5","pts":["point 1","point 2"]}
  ]}
}`);
    APP.exam = JSON.parse(raw);
  } catch {
    APP.exam = FALLBACK_EXAM;
  }

  hideLoading();
  renderExam();
}

function toggleAnswers() {
  APP.showAnswers = !APP.showAnswers;
  document.getElementById('ans-btn').textContent = APP.showAnswers ? '🙈 Hide Answers' : '✅ Show Answers';
  renderExam();
}

function renderExam() {
  const e = APP.exam;
  if (!e) return;
  const sa = APP.showAnswers;

  let html = `
  <div class="exam-cover">
    <div class="exam-cover-tag">PRACTICE EXAMINATION PAPER</div>
    <h1>${e.subject || 'Psychology of Adjustment'}</h1>
    <div class="exam-meta">
      <span>⏱ Time Allowed: ${e.time || '3 Hours'}</span>
      <span>📊 Total Marks: ${e.total || 45}</span>
      <span>📌 All questions are compulsory</span>
    </div>
  </div>

  <!-- Q1 Fill in the Blanks -->
  <div class="exam-q">
    <div class="exam-q-head">
      <span class="exam-q-num">Q.1</span>
      <span class="marks-badge" style="background:var(--blue)">${e.q1?.marks || 15} Marks</span>
    </div>
    <div class="exam-q-sub">${e.q1?.label || 'Fill in the Blanks'}</div>
    ${(e.q1?.items || []).map((item, i) => `
    <div class="blank-item">
      <span class="blank-num">(${i+1})</span>
      <span style="flex:1">${item.q}</span>
      ${sa ? `<span class="blank-ans">→ ${item.a}</span>` : ''}
    </div>`).join('')}
  </div>`;

  // Q2 & Q3 Long Answers
  [e.q2, e.q3].forEach((q, qi) => {
    if (!q) return;
    html += `
  <div class="exam-q">
    <div class="exam-q-head">
      <span class="exam-q-num">Q.${qi+2}</span>
      <span class="marks-badge" style="background:var(--lav)">${q.marks || 15} Marks</span>
    </div>
    <div class="exam-q-sub">Attempt <strong>ANY ONE</strong> of the following:</div>
    <div class="long-option"><b style="color:var(--lav)">A.</b> ${q.A}</div>
    <div class="exam-or">— OR —</div>
    <div class="long-option"><b style="color:var(--blue)">B.</b> ${q.B}</div>
    ${sa && q.hints?.length ? `<div class="hints-box"><div class="hl">✏️ Key points to include in your answer:</div><ul>${q.hints.map(h => `<li>${h}</li>`).join('')}</ul></div>` : ''}
  </div>`;
  });

  // Q4 Short Notes
  if (e.q4) {
    html += `
  <div class="exam-q">
    <div class="exam-q-head">
      <span class="exam-q-num">Q.4</span>
      <span class="marks-badge" style="background:var(--mint);color:#065F46">${e.q4.marks || 15} Marks</span>
    </div>
    <div class="exam-q-sub">Write short notes on <strong>ANY THREE</strong> of the following (5 marks each):</div>
    ${(e.q4.topics || []).map((sn, i) => `
    <div class="short-note-item">
      <b>(${i+1})</b> ${sn.t || sn.topic || sn}
      ${sa && (sn.pts || sn.points)?.length ? `<ul class="sn-pts">${(sn.pts || sn.points).map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}
  </div>`;
  }

  document.getElementById('exam-paper').innerHTML = html;
}

// ── FALLBACK DATA ─────────────────────────────────────────
const FALLBACK_QUIZ = {
  fillBlanks:[
    { q:"Fear of social situations is called _____ phobia.",      a:"social",    hint:"Social anxiety" },
    { q:"Extreme mood swings occur in _____ disorder.",           a:"bipolar",   hint:"Mania + depression" },
    { q:"CBT stands for Cognitive _____ Therapy.",                a:"Behavioral",hint:"Modifying behaviour" },
    { q:"The psychoanalytic approach was developed by _____.",    a:"Freud",     hint:"Austrian neurologist" },
    { q:"Chronic mild depression lasting 2 years is _____.",      a:"dysthymia", hint:"Persistent depressive disorder" },
  ],
  mcq:[
    { q:"Which disorder involves hallucinations and delusions?",          opts:["Depression","Schizophrenia","Anxiety","Phobia"],             correct:1, exp:"Schizophrenia is characterised by positive symptoms: hallucinations, delusions, and disorganised thinking." },
    { q:"What does ECT stand for in mental health treatment?",           opts:["Emotional Control Therapy","Electroconvulsive Therapy","Exposure and Cognitive Therapy","None"], correct:1, exp:"ECT = Electroconvulsive Therapy, used for severe treatment-resistant depression." },
    { q:"Which therapy relies on free association as a core technique?", opts:["CBT","Behaviour Therapy","Psychoanalysis","Group Therapy"],    correct:2, exp:"Freud used free association in psychoanalysis to access unconscious material and repressed memories." },
    { q:"Token economy is a technique in which therapy approach?",       opts:["Psychoanalysis","Behaviour Therapy","Humanistic","Cognitive"], correct:1, exp:"Token economy uses operant conditioning: patients earn tokens for desired behaviours, which they exchange for rewards." },
    { q:"Who developed Person-Centred Therapy?",                        opts:["Freud","Adler","Carl Rogers","Beck"],                          correct:2, exp:"Carl Rogers developed Person-Centred Therapy, emphasising unconditional positive regard, empathy, and congruence." },
  ],
};

const FALLBACK_EXAM = {
  subject:"Psychology of Adjustment", time:"3 Hours", total:45,
  q1:{ label:"Fill in the Blanks", marks:15, items:[
    { q:"Fear of social situations is called _____ phobia.",           a:"social" },
    { q:"Extreme mood swings occur in _____ disorder.",                a:"bipolar" },
    { q:"Hearing voices not present is called _____.",                 a:"hallucination" },
    { q:"False beliefs not based in reality are called _____.",        a:"delusions" },
    { q:"CBT stands for Cognitive _____ Therapy.",                     a:"Behavioral" },
    { q:"The psychoanalytic approach was developed by _____.",         a:"Freud" },
    { q:"Chronic mild depression lasting 2 years is called _____.",    a:"dysthymia" },
    { q:"Repetitive behaviours to reduce anxiety are called _____.",   a:"compulsions" },
    { q:"The DSM is published by the American _____ Association.",     a:"Psychiatric" },
    { q:"Projection of feelings onto the therapist is called _____.",  a:"transference" },
  ]},
  q2:{ marks:15, A:"Explain how definitions of mental illness have changed across time and cultures. Include cultural-bound syndromes with suitable examples.", B:"Discuss the major anxiety disorders — Generalised Anxiety Disorder and OCD — including symptoms, diagnostic criteria, and treatment.", hints:["Historical perspectives on mental illness","Cross-cultural definitions and variability","Culture-bound syndromes: Dhat, Koro, Susto","Evolution of the DSM classification system","Stigma, labelling, and social constructionism"] },
  q3:{ marks:15, A:"Explain eating disorders with reference to anorexia nervosa, bulimia nervosa, and binge eating disorder.", B:"Discuss suicide: psychological and social causes, warning signs, and evidence-based prevention strategies.", hints:["DSM-5 diagnostic criteria for each disorder","Biological, psychological, and sociocultural aetiologies","Gender and cultural differences in prevalence","Therapeutic interventions and recovery outcomes"] },
  q4:{ marks:15, topics:[
    { t:"Psychoanalysis and its Techniques",       pts:["Free association","Dream analysis","Transference & countertransference","Catharsis","Freudian defence mechanisms"] },
    { t:"Person-Centred Therapy (Carl Rogers)",    pts:["Unconditional positive regard","Empathy and congruence","Self-actualisation","Therapeutic relationship"] },
    { t:"Behavioural Therapy & Token Economy",     pts:["Operant conditioning principles","Positive/negative reinforcement","Token economy in clinical settings","Systematic desensitisation"] },
    { t:"Group Therapy",                           pts:["Advantages over individual therapy","Yalom's therapeutic factors","Group dynamics and cohesion","Self-help group models in India"] },
    { t:"Cultural Issues in Mental Health Care",   pts:["Stigma and shame in Indian society","Cultural beliefs about mental illness","Barriers to help-seeking behaviour","Culturally sensitive practice"] },
  ]},
};

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Set PDF.js worker
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // Load daily fact
  initDailyFact();

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(124,107,232,0.12)'
      : 'none';
  });

  // Drag drop on upload zone
  const zone = document.getElementById('upload-zone');
  if (zone) {
    zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', ()  => zone.classList.remove('dragover'));
    zone.addEventListener('drop', handleDrop);
  }
});

// Expose functions to global scope for inline handlers
window.showPage             = showPage;
window.toggleTheme          = toggleTheme;
window.toggleMenu           = toggleMenu;
window.scrollToUpload       = scrollToUpload;
window.loadDemo             = loadDemo;
window.handleFileSelect     = handleFileSelect;
window.handleDrop           = handleDrop;
window.filterCat            = filterCat;
window.openStudy            = openStudy;
window.openFlashcards       = openFlashcards;
window.openFlashcardsFromStudy = openFlashcardsFromStudy;
window.flipCard             = flipCard;
window.fcPrev               = fcPrev;
window.fcNext               = fcNext;
window.setMode              = setMode;
window.triggerQuiz          = triggerQuiz;
window.triggerExam          = triggerExam;
window.openQuiz             = openQuiz;
window.selectMCQ            = selectMCQ;
window.submitQuiz           = submitQuiz;
window.openExam             = openExam;
window.toggleAnswers        = toggleAnswers;
window.APP                  = APP;
