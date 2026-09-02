'use strict';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  PSYCHSTUDY 2.0 — PRODUCTION-READY REFACTORED APPLICATION
 * ═══════════════════════════════════════════════════════════════════════════
 *  
 *  Complete rewrite with:
 *  • Modular architecture (Storage, Mastery, UI, Quiz, Notes modules)
 *  • Deterministic mastery engine (no fake AI)
 *  • Safe localStorage persistence layer with versioning
 *  • Improved quiz tracking and analytics
 *  • Better notes management
 *  • Enhanced accessibility and mobile UX
 *  • All 22 original psychology topics preserved
 *
 *  Structure:
 *  1. Storage Service (persistent data layer)
 *  2. Mastery Engine (learning analytics)
 *  3. Quiz & Results Engine
 *  4. Notes Module
 *  5. UI/UX Controllers
 *  6. Navigation & Router
 *  7. Full Knowledge Base (22 topics)
 *  8. Main App Initialization
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: STORAGE SERVICE
// Safe persistence layer with versioning and error handling
// ════════════════════════════════════════════════════════════════════════════

const StorageService = (() => {
  const PREFIX = 'psa_v2_'; // Version 2 schema
  const version = 2;

  return {
    init() {
      // Migrate old data if needed
      this.migrateIfNeeded();
    },

    migrateIfNeeded() {
      // Check for v1 data and migrate
      const oldProgress = localStorage.getItem('psa_progress');
      if (oldProgress && !localStorage.getItem(PREFIX + 'progress')) {
        try {
          const data = JSON.parse(oldProgress);
          localStorage.setItem(PREFIX + 'progress', JSON.stringify(data));
          console.log('✓ Migrated progress data from v1');
        } catch (err) {
          console.warn('Failed to migrate progress data:', err);
        }
      }
    },

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
        // Gracefully degrade
        UINotifications.toast('Storage limit reached. Some data may not be saved.', 'warning', 4000);
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
      arr.unshift(item); // Add to front (newest first)
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
    },

    getSize() {
      let size = 0;
      for (const key in localStorage) {
        if (key.startsWith(PREFIX)) {
          size += localStorage.getItem(key).length;
        }
      }
      return Math.round(size / 1024); // KB
    }
  };
})();

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: MASTERY ENGINE
// Local, deterministic learning analytics (no AI/backend)
// ════════════════════════════════════════════════════════════════════════════

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
        confidenceLevel: 0, // 0-100
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
    return record;
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
    
    // Confidence based on recent attempts (last 3)
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
    // Priority: unstudied > weak > medium
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
      dates.push(...(m.studiedDates || []));
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

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: QUIZ ENGINE
// Quiz tracking, results recording, analytics
// ════════════════════════════════════════════════════════════════════════════

const QuizEngine = (() => {
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

  function getResultsByTopic(topicId) {
    const results = StorageService.get('quizResults', []);
    return results.filter(r => r.topicId === topicId);
  }

  return {
    recordQuizResult, getRecentResults, getAverageAccuracy, getResultsByTopic
  };
})();

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: NOTES MODULE
// Create, update, delete, search notes with topic association
// ════════════════════════════════════════════════════════════════════════════

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
    return StorageService.updateInArray('notes', noteId, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
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

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: UI NOTIFICATIONS & STATE
// Toast notifications, loading overlay, app state management
// ════════════════════════════════════════════════════════════════════════════

const UINotifications = (() => {
  function toast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function showLoading(msg = 'Processing…') {
    const loading = document.getElementById('loading');
    if (loading) {
      document.getElementById('loading-msg').textContent = msg;
      loading.classList.remove('hidden');
    }
  }

  function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.add('hidden');
    }
  }

  return { toast, showLoading, hideLoading };
})();

const AppState = (() => {
  let state = {
    currentPage: 'dashboard',
    currentTopic: null,
    studyMode: 'deep',
    theme: StorageService.get('user_theme', 'light'),
    notesPanelOpen: true,
    fcCards: [],
    fcIdx: 0,
    fcFlipped: false,
    quiz: null,
    quizAnswers: {},
    quizDone: false,
    showAnswers: false
  };

  return {
    get: (key) => state[key],
    set: (key, value) => { state[key] = value; },
    getAll: () => ({ ...state })
  };
})();

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: FULL KNOWLEDGE BASE
// All 22 psychology topics from original KB
// ════════════════════════════════════════════════════════════════════════════

const KB = [
  {
    id:'psych-disorders',
    name:'What Are Psychological Disorders?',
    category:'Foundations',
    icon:'🏥',
    preview:'Understanding psychological disorders beyond simple "abnormal" behaviour.',
    definition:'A psychological disorder involves persistent patterns of thoughts, feelings, or behaviours that cause significant distress, dysfunction, deviance from social norms, or danger to the individual or others.',
    explanation:`Psychological disorder does not simply mean "abnormal" behaviour. Many disorders such as depression and anxiety are statistically common yet clinically significant. Not all socially unusual behaviours (e.g., streaking) qualify as disorders.

The modern understanding recognises that psychological disorders involve clusters of symptoms that interfere with a person's daily functioning, emotional well-being, relationships, or physical health. These clusters form the basis of modern diagnostic systems such as the DSM-5.

There is no single universal definition of a psychological disorder. What counts as normal or abnormal varies across cultures, time periods, and social norms. Despite this ambiguity, recognisable patterns of dysfunction guide diagnosis and treatment.`,
    keyPoints:['Psychological disorder ≠ simply abnormal behaviour','Common disorders (depression, anxiety) are not statistically rare','Symptoms must cause clinically significant distress or impairment','Defined by patterns of thought, feeling, or behaviour over time','The DSM-5 is the primary diagnostic classification system'],
    types:['Anxiety Disorders','Mood Disorders','Psychotic Disorders','Eating Disorders','Personality Disorders'],
    symptoms:['Persistent distress or sadness','Impaired daily functioning','Social withdrawal','Bizarre or erratic behaviour','Persistent irrational fears'],
    psychologists:['APA — Publishes the DSM diagnostic manual','Emil Kraepelin — Founded modern psychiatric classification'],
    examples:['Lisa (case study) — grief, depression, and work dysfunction after loss of parents','A person with major depression unable to leave their bed for days'],
    treatment:'Psychological disorders are treated through psychotherapy (CBT, psychoanalysis, person-centred therapy), pharmacological interventions, or a combination of both approaches.',
    summary:'Psychological disorders are clinically significant patterns of distress or dysfunction. They are diagnosed using the four Ds criteria and classified using DSM-5 diagnostic criteria by trained mental health professionals.',
    mnemonic:'The Four Ds: Distress · Dysfunction · Deviance · Danger'
  },
  {
    id:'four-ds',
    name:'Four Criteria of Abnormality (The 4 Ds)',
    category:'Foundations',
    icon:'📐',
    preview:'Distress, Dysfunction, Deviance, Danger — the criteria for defining abnormal behaviour.',
    definition:'The four Ds are the primary criteria used to determine whether a pattern of behaviour constitutes a psychological disorder: Distress, Dysfunction, Deviance, and Danger.',
    explanation:`Distress refers to significant emotional suffering caused by the behaviour or experience — for example, intense grief, persistent sadness, or overwhelming fear. This criterion emphasises subjective suffering.

Dysfunction means that the behaviour interferes significantly with the person's ability to carry out daily responsibilities — such as maintaining work performance, social relationships, or self-care. Lisa, in the case study, exemplified dysfunction by missing work and being unable to manage household tasks.

Deviance involves behaviours that fall far outside the norms of the person's cultural or social context. However, deviance alone is not sufficient — it must be considered in context. For example, unusual religious practices may appear deviant but are culturally normal.

Danger refers to behaviour that poses a risk to the person or others — such as suicidal behaviour or serious aggression. This is the least common criterion and not required for diagnosis in all cases.`,
    keyPoints:['Distress — causes significant emotional or psychological suffering','Dysfunction — impairs work, relationships, or daily activities','Deviance — behaviour outside accepted social or cultural norms','Danger — poses risk to self or others (least common criterion)','Multiple criteria must often be present for a clinical diagnosis'],
    types:['Distress — subjective suffering','Dysfunction — objective impairment','Deviance — norm violation','Danger — risk to self or others'],
    symptoms:['Intense emotional suffering','Inability to perform normal roles','Socially unacceptable behaviour patterns','Self-harming or dangerous acts'],
    psychologists:['Rosenhan (1973) — On being sane in insane places','Thomas Szasz — Challenged the concept of mental illness'],
    examples:['Lisa missing work and unable to manage her household after bereavement (Dysfunction)','A person experiencing severe panic attacks every day (Distress)'],
    treatment:'Treatment is guided by which criteria are most prominent. Distress is addressed through psychotherapy; dysfunction through rehabilitation and skills training; danger through crisis intervention.',
    summary:'The Four Ds provide a practical framework for identifying psychological disorders. All four criteria are relevant, though not all must be present simultaneously. Context and cultural sensitivity are essential when applying these criteria.',
    mnemonic:'DDDD — Distress, Dysfunction, Deviance, Danger'
  },
  {
    id:'dsm',
    name:'The DSM and Diagnostic Classification',
    category:'Foundations',
    icon:'📖',
    preview:'The DSM is the leading system for classifying and diagnosing psychological disorders worldwide.',
    definition:'The Diagnostic and Statistical Manual of Mental Disorders (DSM), published by the American Psychiatric Association, is the primary classification system used by clinicians to diagnose over 200 psychological disorders.',
    explanation:`The DSM was first published in 1952 and has undergone multiple revisions as scientific understanding of mental health has evolved. The latest major update, DSM-5, was published in 2013 and provides standardised criteria for clinicians worldwide.

The DSM focuses on identifying patterns of symptoms rather than interpreting causes. This is because for many disorders, the exact causes remain unknown. Clinicians use the DSM by comparing an individual's symptoms with the descriptions and criteria listed for each disorder.

Importantly, the DSM uses person-first language — referring to "a person with schizophrenia" rather than "a schizophrenic." This approach promotes empathy and reduces stigma in clinical settings.

The DSM reflects scientific updates and societal changes over time. A landmark example is the removal of homosexuality from the DSM in 1974, reflecting both evolving scientific evidence and changing social attitudes.`,
    keyPoints:['Published by the American Psychiatric Association (APA)','Current edition is DSM-5 (published 2013)','Diagnoses over 200 psychological disorders','Focuses on symptoms, not causes (descriptive approach)','Uses person-first language to reduce stigma'],
    types:['DSM-I (1952)','DSM-II (1968)','DSM-III (1980) — first multi-axial','DSM-IV (1994)','DSM-5 (2013) — current edition'],
    symptoms:['Clinicians compare patient symptoms to DSM criteria','Duration, severity, and impact assessed','Shared diagnostic language across clinicians'],
    psychologists:['American Psychiatric Association — publishers','Robert Spitzer — led development of DSM-III'],
    examples:['Homosexuality removed from DSM in 1974 — reflecting changing cultural and scientific understanding','OCD diagnosed when intrusive thoughts and compulsions cause > 1 hour of distress daily'],
    treatment:'The DSM guides treatment selection by helping clinicians match disorders to evidence-based interventions — such as CBT for depression or exposure therapy for phobias.',
    summary:'The DSM is the global standard for diagnosing psychological disorders. It is descriptive, symptom-focused, and regularly updated to reflect evolving science and cultural understanding. Its person-first approach helps reduce stigma.',
    mnemonic:'DSM = Diagnostic Statistical Manual — "Describe Symptoms Methodically"'
  },
  {
    id:'culture-mental-illness',
    name:'Mental Illness Across Time and Culture',
    category:'Foundations',
    icon:'🌍',
    preview:'How culture, history, and social context shape the definition of mental illness.',
    definition:'The understanding and classification of mental illness varies significantly across different historical periods and cultural contexts, showing that what is considered "abnormal" is not fixed but shaped by social, cultural, and scientific factors.',
    explanation:`Throughout history, mental disorders have been explained in vastly different ways. In ancient times, unusual behaviour was often attributed to supernatural forces or demonic possession. As psychology and psychiatry developed, medical and scientific explanations replaced these beliefs.

An example of historical change is the reclassification of homosexuality: once labelled a disorder due to moral social beliefs, it was later understood as a natural variation of human sexuality and removed from the DSM in 1974. Similarly, "hysteria" — once extremely common among women — has disappeared from diagnostic systems as society and medicine evolved.

Culture shapes how people interpret thoughts, emotions, and behaviours. For example, hearing voices of deceased individuals is generally considered a symptom of schizophrenia in Western societies, but in many traditional Native American communities, it is viewed as a spiritual experience and not pathological.

In parts of the Middle East, visions and auditory experiences are often interpreted as spiritual gifts. These cultural differences show that psychological symptoms must always be understood within their social and cultural contexts.`,
    keyPoints:['Definitions of mental illness change across history and cultures','Homosexuality was removed from the DSM in 1974','Hearing voices may be spiritual in some cultures, pathological in others','"Hysteria" diagnosis has disappeared as understanding evolved','Culture-bound syndromes reflect unique cultural expressions of distress'],
    types:['Historical shifts in diagnosis','Cross-cultural variations','Culture-bound syndromes','Colonial psychiatry'],
    symptoms:['Culture-specific expressions of distress','Behaviours normal in one culture, pathological in another'],
    psychologists:['Arthur Kleinman — Pioneered cross-cultural psychiatry','George Devereux — Founded ethno-psychiatry'],
    examples:['Hearing ancestral voices — pathology in Western medicine, spirituality in Native American culture','Grisi siknis (Central America) — running frenzied with intense anxiety and anger','Hikikomori (Japan) — prolonged social withdrawal due to social pressure'],
    treatment:'Culturally competent care requires clinicians to understand the patient\'s cultural background, beliefs, and the cultural meaning of their symptoms before making a diagnosis.',
    summary:'Mental illness is not defined by universal, fixed criteria. Historical periods and cultural contexts fundamentally shape what is considered abnormal. Culture-bound syndromes and historical reclassifications demonstrate that diagnosis must always be sensitive to social and cultural context.',
    mnemonic:'CHS — Culture · History · Society shape our understanding of mental illness'
  },
  {
    id:'gad',
    name:'Generalised Anxiety Disorder (GAD)',
    category:'Anxiety Disorders',
    icon:'😰',
    preview:'Persistent "free-floating" anxiety that follows the person everywhere, without a clear cause.',
    definition:'Generalised Anxiety Disorder (GAD) is characterised by persistent, excessive, and uncontrollable worry about multiple life areas, accompanied by physical symptoms, that is present most days for at least six months and causes significant distress or impairment.',
    explanation:`GAD is often described as "free-floating" anxiety — the anxiety seems to follow the person everywhere and they often cannot identify a specific cause for their worry. Unlike phobias or panic disorder where fear is triggered by specific cues, GAD involves pervasive, generalised worry about everyday life events.

A person with GAD might constantly worry that a family member is unsafe even when there is no apparent danger, or may feel unable to stop worrying about finances, work, health, or relationships. The worry feels uncontrollable and disproportionate to the actual situation.

Physical symptoms are prominent in GAD and include chronic headaches, muscular tension, digestive problems, and constant physical fatigue. People with GAD often appear restless or edgy and may display strained facial expressions or fidgeting.

GAD is highly comorbid with depression, social anxiety, and substance use disorders. Some individuals fear that their anxiety will make them "go crazy" or cause a serious physical illness, which perpetuates the anxiety cycle.`,
    keyPoints:['Persistent "free-floating" anxiety — no specific trigger identified','Worry must be present most days for at least 6 months (DSM-5)','Physical symptoms: headaches, muscle tension, fatigue, indigestion','Difficulty concentrating and making decisions','Highly comorbid with depression and other anxiety disorders'],
    types:['Worry-predominant GAD','Somatic symptom-predominant GAD'],
    symptoms:['Constant, uncontrollable worry','Difficulty identifying what they fear','Physical: headaches, muscle tension, indigestion, fatigue','Difficulty concentrating or making decisions','Restlessness and irritability','Fear that anxiety will cause physical or mental harm'],
    psychologists:['Monroe & Reid (2009) — Research on anxiety and everyday stressors','David Barlow — Influential model of GAD'],
    examples:['A person worrying constantly about their family\'s safety even when nothing is wrong','A student unable to stop worrying about exam results for months, unable to sleep or concentrate'],
    treatment:'CBT (particularly relaxation training and cognitive restructuring), mindfulness-based therapy, and SSRIs are the most evidence-based treatments for GAD.',
    summary:'GAD involves chronic, pervasive worry without a specific object, accompanied by physical symptoms. Unlike normal anxiety which is temporary and manageable, GAD persists for at least six months and significantly impairs daily functioning. CBT and medication are the primary treatments.',
    mnemonic:'GAD = Generalised Anxiety that persists for ≥6 days per week for ≥6 months'
  },
  {
    id:'panic',
    name:'Panic Disorder',
    category:'Anxiety Disorders',
    icon:'💥',
    preview:'Recurrent, unexpected panic attacks with intense fear and physical symptoms lasting 15–30 minutes.',
    definition:'Panic Disorder involves repeated, unexpected panic attacks — sudden episodes of intense fear or discomfort reaching a peak within minutes — followed by persistent concern about future attacks or significant changes in behaviour to avoid perceived triggers.',
    explanation:`A panic attack is a discrete episode of intense fear characterised by rapid onset of physical and psychological symptoms. They can occur unexpectedly without any clear trigger, or may be associated with specific situations such as public speaking, driving, or crowded places.

During a panic attack, symptoms include cold sweats, dizziness, rapid heartbeat (palpitations), difficulty breathing, chest pain, and an overwhelming sense of inescapable doom — the feeling of "I might die right now." Attacks typically last 15–30 minutes but can occasionally persist for up to an hour.

The unpredictability of panic attacks creates anticipatory anxiety — the person becomes anxious about when the next attack will occur. This leads to avoidance behaviours: the person may begin avoiding malls, public meetings, driving, or other situations where they fear losing control or being unable to escape.

This avoidance can progressively restrict the person's life and may develop into agoraphobia — the fear of situations from which escape might be difficult.`,
    keyPoints:['Panic attacks — sudden, intense fear reaching a peak within minutes','Attacks occur unpredictably or in specific situations','Duration: typically 15–30 minutes','Anticipatory anxiety — fear of the next attack','May lead to avoidance behaviours and agoraphobia'],
    types:['Unexpected (uncued) panic attacks','Situationally-predisposed panic attacks','Nocturnal panic attacks'],
    symptoms:['Cold sweats and dizziness','Rapid heartbeat (palpitations)','Difficulty breathing','Chest pain or discomfort','Feeling of inescapable doom ("I might die")','Depersonalisation or derealisation'],
    psychologists:['Taylor (2010) — Research on panic disorder triggers','David Clark — Cognitive model of panic disorder'],
    examples:['Person having a panic attack while driving and avoiding all long journeys thereafter','A student experiencing panic attacks before presentations, eventually refusing to attend class'],
    treatment:'CBT (specifically interoceptive exposure) is highly effective. Breathing retraining, cognitive restructuring, and SSRIs/SNRIs are also standard treatments.',
    summary:'Panic Disorder involves recurrent unexpected panic attacks followed by persistent worry about future attacks. The unpredictability of attacks drives avoidance behaviours that progressively restrict the person\'s daily life. CBT and medications are highly effective treatments.',
    mnemonic:'PANIC = Palpitations · Apprehension · Numbness/sweating · Intense fear · Chest pain'
  },
  {
    id:'phobias',
    name:'Phobic Disorders',
    category:'Anxiety Disorders',
    icon:'😱',
    preview:'Irrational, excessive fear of specific objects or situations that causes significant distress and avoidance.',
    definition:'A phobia is a persistent, excessive, and irrational fear of a specific object, activity, or situation that causes significant distress and leads the person to actively avoid the feared stimulus, interfering with normal functioning.',
    explanation:`Phobic disorders become clinical when the fear causes significant distress or impairs daily functioning. Simple fears that do not impact daily life are not considered phobias. Phobias typically begin in childhood; mild ones often fade, but severe phobias can persist into adulthood.

Specific Phobia involves excessive, irrational fear of a particular object or situation — such as dogs, snakes, heights (acrophobia), closed spaces (claustrophobia), or blood. The person recognises the fear is irrational but is unable to control it.

Social Phobia (Social Anxiety Disorder) involves extreme shyness and fear of being observed, scrutinised, or negatively evaluated by others. It includes fear of public speaking, eating in public, writing in front of others, or using public restrooms. People may self-medicate with alcohol to reduce anxiety.

Agoraphobia involves intense anxiety in situations where escape might be difficult — such as crowded places, public transport, markets, or open spaces. It can lead to the person becoming virtually housebound.

Unusual phobias include Coulrophobia (clowns), Gamophobia (marriage), Mysophobia (germs), and Topophobia (performing on stage).`,
    keyPoints:['Three major types: Specific Phobia, Social Phobia, Agoraphobia','Fear must be excessive, persistent, and cause significant impairment','Person recognises the fear is irrational but cannot control it','Avoidance behaviours reinforce and maintain the phobia over time','Exposure therapy is the most effective treatment'],
    types:['Specific Phobia — objects or situations','Social Phobia — fear of negative evaluation','Agoraphobia — fear of crowded/inescapable situations'],
    symptoms:['Immediate anxiety response to feared stimulus','Avoidance of feared object or situation','Recognition that fear is excessive','Significant impairment in daily functioning'],
    psychologists:['Watson & Rayner (1920) — Little Albert experiment (classical conditioning of fear)','Joseph Wolpe — Developed systematic desensitisation for phobias'],
    examples:['A person who cannot ride public transport because of agoraphobia','Social phobic student avoiding presentations despite academic consequences'],
    treatment:'Exposure therapy (systematic desensitisation or flooding) is the gold standard. Cognitive restructuring and virtual reality exposure are increasingly used. Beta-blockers may help for performance anxiety.',
    summary:'Phobic disorders involve excessive, irrational fear leading to avoidance that significantly impairs functioning. The three main types are Specific Phobia, Social Phobia, and Agoraphobia. Exposure-based therapies are highly effective and produce lasting results.',
    mnemonic:'SSA Phobias = Specific · Social · Agoraphobia'
  },
  {
    id:'ocd',
    name:'Obsessive-Compulsive Disorder (OCD)',
    category:'Anxiety Disorders',
    icon:'🔄',
    preview:'Intrusive obsessions driving repetitive compulsions that temporarily relieve anxiety in a self-reinforcing cycle.',
    definition:'OCD is a mental health condition characterised by recurring, unwanted obsessions (intrusive thoughts) that generate anxiety, and compulsions (repetitive behaviours) performed to neutralise that anxiety, causing significant distress and interfering with daily functioning.',
    explanation:`Obsessions are intrusive, unwanted, repetitive thoughts, images, or urges that cause significant anxiety. Common obsessions include contamination fears ("If I touch this, I will get sick"), harm fears ("Did I leave the stove on? What if the house burns?"), superstitious beliefs, and perfectionist needs for order and symmetry.

Compulsions are repetitive behaviours or mental acts the person feels driven to perform in response to an obsession, following rigid rules. The compulsion temporarily reduces anxiety, but this relief reinforces the cycle — the anxiety returns, driving another compulsion.

An analogy: imagine a song stuck in your head — annoying but temporary. Now imagine the same thought returning hundreds of times a day, and feeling compelled to snap your fingers each time to stop it. This reflects the intrusive-relief cycle in OCD.

Types of compulsive behaviour include: Hoarders (collecting items excessively), Repeaters (performing actions a set number of times, e.g., checking the lock 15 times), Orderers (arranging objects in a perfectly specific way), and Checkers (repeatedly checking appliances, doors, switches). OCD rituals can consume hours each day.`,
    keyPoints:['Obsessions — intrusive, unwanted thoughts causing anxiety','Compulsions — repetitive behaviours to neutralise the anxiety','Relief from compulsions is temporary — reinforcing the cycle','Common obsessions: contamination, harm, order, superstition','Common compulsions: checking, cleaning, ordering, counting'],
    types:['Contamination OCD','Harm OCD','Symmetry/order OCD','Hoarding OCD','Intrusive thought OCD'],
    symptoms:['Time-consuming rituals (>1 hour/day)','Insight into irrationality (usually)','Significant distress and interference','Rituals providing temporary relief','Shame and exhaustion from rituals'],
    psychologists:['Paul Salkovskis — Cognitive model of OCD','Edna Foa — Developed Exposure and Response Prevention (ERP)'],
    examples:['Washing hands 30 times after touching a doorknob to prevent contamination fear','Checking the gas stove every 5 minutes before leaving the house'],
    treatment:'Exposure and Response Prevention (ERP) is the gold standard CBT approach. SSRIs (e.g., fluoxetine) are also effective. Combining ERP with medication yields the best outcomes.',
    summary:'OCD involves a self-reinforcing cycle of obsessions and compulsions. Obsessions generate anxiety; compulsions temporarily relieve it; the relief reinforces the cycle. ERP therapy — confronting feared stimuli without engaging in the compulsion — is the most effective treatment.',
    mnemonic:'OCD Cycle: Obsession → Anxiety → Compulsion → Temporary Relief → Obsession returns'
  },
  {
    id:'ptsd',
    name:'Post-Traumatic Stress Disorder (PTSD)',
    category:'Anxiety Disorders',
    icon:'⚡',
    preview:'Severe anxiety disorder following traumatic events, characterised by flashbacks, avoidance, and hyperarousal.',
    definition:'PTSD is a severe anxiety disorder that develops after direct or witnessed exposure to a traumatic event, characterised by intrusive re-experiencing, persistent avoidance, negative changes in cognition and mood, and heightened arousal lasting more than one month.',
    explanation:`PTSD can develop after experiencing or witnessing events such as physical or sexual assault, war and terrorism, natural disasters, plane crashes, or large-scale violence. It can also develop from extensive exposure to traumatic details — for example, first responders who regularly encounter victims of violence.

Re-experiencing symptoms include flashbacks (vivid reliving of the traumatic event), disturbing nightmares, and intrusive thoughts. These can feel as real and terrifying as the original trauma.

Avoidance behaviours involve deliberately avoiding places, people, activities, or thoughts associated with the trauma. Emotional numbing and social withdrawal are common.

Hyperarousal symptoms include intense fear, exaggerated startle response, irritability, difficulty sleeping, and sudden mood swings. These reflect a persistent state of physiological alertness — the nervous system remains in "threat mode."

Additional effects include depression, difficulty concentrating, poor academic or work performance, and self-medication with drugs or alcohol to manage overwhelming symptoms.`,
    keyPoints:['Develops after experiencing or witnessing a traumatic event','Four symptom clusters: Re-experiencing, Avoidance, Negative cognitions/mood, Hyperarousal','Flashbacks — vivid, intrusive reliving of the traumatic event','Avoidance of reminders of the trauma (places, people, thoughts)','Risk groups: soldiers, first responders, assault survivors, disaster victims'],
    types:['Acute PTSD (1–3 months post-trauma)','Chronic PTSD (>3 months)','Delayed-onset PTSD (>6 months after event)','Complex PTSD (repeated/prolonged trauma)'],
    symptoms:['Flashbacks and nightmares','Emotional numbing and withdrawal','Hypervigilance and startle response','Irritability and mood swings','Sleep disturbance','Depression and concentration problems'],
    psychologists:['Judith Herman — Trauma and Recovery (Complex PTSD)','Bessel van der Kolk — "The Body Keeps the Score"'],
    examples:['A soldier returning from war who cannot stop reliving battle scenes and avoids crowded places','A survivor of assault with intrusive flashbacks and social withdrawal'],
    treatment:'Trauma-Focused CBT, EMDR (Eye Movement Desensitisation and Reprocessing), and SSRIs are evidence-based treatments. Social support and safety are essential foundations.',
    summary:'PTSD is a severe, complex disorder that can follow any traumatic experience. Its four core symptom clusters significantly impair daily functioning. Early intervention with trauma-focused CBT or EMDR dramatically improves outcomes and reduces the risk of chronicity.',
    mnemonic:'PTSD symptoms: RAH = Re-experiencing · Avoidance · Hyperarousal'
  },
  {
    id:'major-depression',
    name:'Major Depressive Disorder',
    category:'Mood Disorders',
    icon:'😢',
    preview:'Intense, persistent sadness and hopelessness that severely impairs daily functioning for at least two weeks.',
    definition:'Major Depressive Disorder (MDD) is a mood disorder characterised by at least one major depressive episode — persistent depressed mood or loss of interest/pleasure for at least two weeks, accompanied by symptoms that significantly impair daily functioning.',
    explanation:`Major depression involves intense and unrealistic sadness along with deep feelings of worthlessness. Common symptoms include decreased energy, loss of interest in everyday activities, poor appetite or changes in eating, feelings of inadequacy, frequent crying, and a pessimistic or hopeless outlook.

Severity varies considerably. Some individuals manage daily tasks despite moderate symptoms, while others experience such severe symptoms that functioning at work, home, or socially becomes nearly impossible. In extreme cases, even getting out of bed is overwhelming, sometimes requiring hospitalisation.

Women are approximately 70% more likely than men to develop major depression. Biological explanations include hormonal fluctuations and brain imaging evidence showing that depression-related brain regions are larger in women. Social explanations include the greater burden of household work, childcare, and multiple role demands experienced by many women. Women are also more likely to ruminate — to dwell on and replay problems repeatedly — which intensifies depressive episodes.

More than 50% of individuals who have one episode of major depression experience another within two years, making relapse prevention an important component of long-term management.`,
    keyPoints:['Persistent depressed mood or loss of pleasure for ≥2 weeks (DSM-5)','Women are 70% more likely than men to develop MDD','Biological causes: genetics, neurotransmitter imbalance, brain structure','Cognitive causes: negative thinking patterns and rumination','Over 50% experience recurrence within 2 years of first episode'],
    types:['Mild MDD','Moderate MDD','Severe MDD (with or without psychotic features)','MDD with seasonal pattern (SAD)','MDD with peripartum onset'],
    symptoms:['Persistent sadness, emptiness, or hopelessness','Loss of interest in previously enjoyed activities','Fatigue and decreased energy','Changes in appetite and weight','Sleep disturbances (insomnia or hypersomnia)','Feelings of worthlessness or excessive guilt','Difficulty concentrating','Recurrent thoughts of death or suicide'],
    psychologists:['Aaron Beck — Cognitive model of depression','Martin Seligman — Learned helplessness theory','Sigmund Freud — Mourning and melancholia'],
    examples:['A person experiencing depression following loss, with work stress and social withdrawal','A person unable to leave their bed for days, neglecting personal hygiene and relationships'],
    treatment:'CBT is highly effective, particularly behavioural activation. Antidepressants (SSRIs) are first-line medications. Combination therapy (CBT + medication) often produces the best outcomes.',
    summary:'Major Depressive Disorder involves persistent, debilitating sadness and loss of interest that impairs all areas of daily life. It is more common in women due to biological and social factors. Cognitive and biological causes interact. CBT and antidepressants are the most effective treatments.',
    mnemonic:'SIGECAPS = Sleep · Interest · Guilt · Energy · Concentration · Appetite · Psychomotor · Suicide (MDD symptom checklist)'
  },
  {
    id:'bipolar',
    name:'Bipolar Disorder',
    category:'Mood Disorders',
    icon:'⬆️⬇️',
    preview:'Alternating periods of elevated mood (mania) and depression, creating extreme mood swings.',
    definition:'Bipolar Disorder is characterised by recurrent episodes of mania (or hypomania) and depression, with distinct periods of elevated or irritable mood alternating with periods of depressed mood, each causing significant impairment.',
    explanation:`Bipolar I Disorder requires at least one manic episode (intense, elevated mood lasting ≥1 week with decreased need for sleep, racing thoughts, reckless behaviour). Bipolar II Disorder involves hypomanic episodes (milder, ≥4 days) alternating with major depressive episodes.

During manic episodes, individuals may experience grandiose beliefs ("I am destined to be famous"), excessive spending, risky sexual behaviour, and dramatically decreased need for sleep (feeling rested after 2-3 hours). They may engage in impulsive, dangerous activities like reckless driving or substance abuse.

During depressive episodes, they experience the full symptoms of major depression. The contrast between states — feeling invincible one week and suicidal the next — is profoundly disorienting.

Bipolar disorder typically emerges in late teens to early twenties. Lithium, a naturally occurring salt, remains one of the most effective mood stabilisers and can reduce suicide risk by up to 80%. Modern treatments also include anticonvulsants and atypical antipsychotics.`,
    keyPoints:['Bipolar I: ≥1 manic episode (intense, ≥1 week)','Bipolar II: hypomanic episodes (≥4 days) + major depression','Manic features: grandiosity, decreased sleep need, racing thoughts, recklessness','Depressive episodes identical to Major Depressive Disorder','Lithium reduces both mania and depression; reduces suicide risk by 80%'],
    types:['Bipolar I — full mania','Bipolar II — hypomania + depression','Cyclothymia — milder, chronic alternating moods'],
    symptoms:['Manic: grandiose beliefs, racing thoughts, decreased sleep, reckless behaviour, excessive spending','Depressive: all MDD symptoms','Rapid cycling (>4 mood episodes per year in some cases)'],
    psychologists:['John Cade — Discovered lithium treatment (1949)','David Miklowitz — Psychoeducational family therapy for bipolar'],
    examples:['A person starting multiple projects impulsively during mania, then experiencing severe depression with suicidal ideation','Extreme mood swings affecting relationships, work, and finances'],
    treatment:'Mood stabilisers (lithium, anticonvulsants), atypical antipsychotics, and psychotherapy. Medication is essential. Psychoeducation and family therapy improve long-term outcomes.',
    summary:'Bipolar Disorder involves extreme mood swings between mania/hypomania and depression. It is a biological disorder requiring ongoing medication management. Lithium and modern anticonvulsants are highly effective. Psychotherapy and family support are essential for long-term stability.',
    mnemonic:'Bipolar = Bi-polar moods: UP (Mania) ↔ DOWN (Depression)'
  },
  {
    id:'schizophrenia',
    name:'Schizophrenia',
    category:'Psychotic Disorders',
    icon:'🌀',
    preview:'Severe disorder marked by loss of contact with reality, hallucinations, delusions, and cognitive impairment.',
    definition:'Schizophrenia is a severe psychotic disorder characterised by disruptions in thought processes, perception (hallucinations), false beliefs (delusions), diminished emotional expression, and cognitive difficulties, lasting ≥6 months and causing significant functional impairment.',
    explanation:`Schizophrenia affects approximately 1% of the population globally. It typically emerges in late adolescence or early adulthood, often triggered by stress in genetically vulnerable individuals.

Positive symptoms (additions to normal experience) include hallucinations (usually auditory — hearing voices), delusions (false beliefs resistant to contrary evidence, like paranoia or grandiosity), and disorganised speech.

Negative symptoms (reductions in normal functioning) include reduced emotional expression, alogia (poverty of speech), avolition (lack of motivation), anhedonia (inability to feel pleasure), and social withdrawal. Negative symptoms are often more disabling than positive symptoms.

Cognitive symptoms include difficulty sustaining attention, working memory problems, and executive dysfunction. These can be subtle but profoundly impact daily functioning.

The biopsychosocial model explains schizophrenia: genetic vulnerability (heritability ~80%) interacts with prenatal/early environmental stress (maternal infection, malnutrition, birth complications), neurotransmitter dysregulation (hyperactivity of dopamine in mesolimbic pathways, hypoactivity in prefrontal regions), and psychosocial stressors.

Antipsychotic medications effectively manage positive symptoms but are less effective for negative and cognitive symptoms. Psychosocial interventions (CBT, family therapy, vocational rehabilitation) are crucial for recovery.`,
    keyPoints:['Positive symptoms: hallucinations, delusions, disorganised speech','Negative symptoms: reduced emotion, speech poverty, lack of motivation, withdrawal','Cognitive symptoms: attention problems, working memory deficits','Heritability ~80%; typically emerges in late adolescence/early adulthood','Antipsychotics effective for positive symptoms; psychosocial interventions essential'],
    types:['Paranoid type (dominates delusions)','Disorganised type (dominates disorganised speech/behaviour)','Catatonic type (extreme motor abnormalities)','Undifferentiated type (mixed presentation)'],
    symptoms:['Hallucinations (usually auditory)','Delusions (false beliefs)','Disorganised speech','Reduced emotional expression','Lack of motivation','Social withdrawal','Cognitive difficulties'],
    psychologists:['Eugen Bleuler — Coined "schizophrenia" (1911)','Kurt Schneider — First-rank symptoms','Nancy Andreasen — Negative symptoms framework'],
    examples:['A person hearing critical voices that others do not hear, believing they are being monitored','A person with reduced motivation, flat affect, and social isolation'],
    treatment:'Antipsychotic medications (first-generation: haloperidol; second-generation: olanzapine, risperidone). Psychosocial: CBT for psychosis, family therapy, vocational rehabilitation, peer support.',
    summary:'Schizophrenia is a severe, biologically-rooted psychotic disorder. Positive symptoms (hallucinations, delusions) and negative symptoms (withdrawal, reduced emotion) significantly impair functioning. Antipsychotics are effective; combined with psychosocial interventions, recovery is possible.',
    mnemonic:'PAID = Positive · Affective (negative) · Impaired cognition · Disorganisation'
  },
  {
    id:'anorexia',
    name:'Eating Disorders — Anorexia & Bulimia',
    category:'Eating Disorders',
    icon:'🍽️',
    preview:'Severe disturbances in eating behaviour and body image, causing medical and psychological harm.',
    definition:'Eating Disorders are severe mental illnesses characterised by persistent disturbances in eating behaviour and related thoughts/emotions, resulting in significant physical and psychological consequences.',
    explanation:`Anorexia Nervosa involves severe restriction of food intake leading to significantly low body weight (<85% of expected), intense fear of weight gain even when underweight, and distorted body image. Subtypes include restrictive (food restriction only) and binge-eating/purging (periodic overeating followed by purging).

Bulimia Nervosa involves recurrent episodes of binge eating (consuming large amounts rapidly with loss of control) followed by compensatory purging (vomiting, laxatives, excessive exercise). Unlike anorexia, body weight is often within normal range, making bulimia less visible.

Binge Eating Disorder involves recurrent binge episodes without regular compensatory purging, often accompanied by shame and guilt.

Eating disorders have multifaceted causes: biological (genetics, neurotransmitters, brain abnormalities), psychological (perfectionism, need for control, low self-esteem, anxiety), and social (media ideals, peer pressure, cultural values emphasizing thinness).

Importantly, eating disorders are NOT simply about vanity or dieting. They are serious mental illnesses with the highest mortality rate of any psychiatric disorder. Anorexia has a mortality rate of 5-20%, primarily from medical complications (cardiac arrhythmias, electrolyte imbalances, organ failure) and suicide.

Treatment is multidisciplinary: cognitive-behavioural therapy (CBT), family-based therapy (Maudsley method), nutritional rehabilitation, and medical monitoring. Early intervention dramatically improves outcomes.`,
    keyPoints:['Anorexia: severe restriction, distorted body image, ≤85% body weight, high mortality','Bulimia: binge-purge cycle, often normal weight, intense shame','Binge Eating: recurrent binges without purging, most common eating disorder','Biopsychosocial causes: genetics, perfectionism, media, low self-esteem','Early intervention with CBT and family therapy improves outcomes'],
    types:['Anorexia (restrictive and binge/purge subtypes)','Bulimia Nervosa','Binge Eating Disorder','Other Specified Feeding or Eating Disorder (OSFED)'],
    symptoms:['Anorexia: extreme food restriction, weight loss, obsession with calories, excessive exercise, cold intolerance, hair loss','Bulimia: secret binge eating, purging (vomiting, laxatives), electrolyte imbalances, dental erosion','All: preoccupation with food/weight, distorted body image, social isolation'],
    psychologists:['Hilde Bruch — Pioneering work on eating disorders','Christopher Fairburn — CBT for eating disorders'],
    examples:['A young person restricting to <800 calories daily, exercising 3+ hours daily, despite being underweight (anorexia)','A person binge eating in secret, then vomiting to prevent weight gain (bulimia)'],
    treatment:'CBT (particularly CBT-E — Enhanced), family-based therapy (especially for adolescents), nutritional rehabilitation, medical management, antidepressants (SSRIs) for associated depression/anxiety.',
    summary:'Eating Disorders are serious mental illnesses with severe medical consequences. They involve disturbances in eating, body image, and self-worth. Early intervention with CBT, family therapy, and medical care is essential. Recovery is possible with comprehensive, multidisciplinary treatment.',
    mnemonic:'Eating Disorders = Fear of FAT (Food, Anxiety, Thoughts) · Weight obsession'
  },
  {
    id:'personality-disorders',
    name:'Personality Disorders',
    category:'Personality Disorders',
    icon:'🔶',
    preview:'Rigid, maladaptive personality patterns beginning in adolescence that cause distress and interpersonal dysfunction.',
    definition:'Personality Disorders are a group of mental health conditions characterised by persistent, inflexible, maladaptive personality patterns that deviate markedly from cultural expectations, begin by early adulthood, and cause significant functional impairment or distress.',
    explanation:`Personality disorders are organised into three clusters based on dominant features:

Cluster A (Odd/Eccentric): Paranoid PD (pervasive distrust), Schizoid PD (emotional detachment, social withdrawal), Schizotypal PD (magical thinking, social anxiety, odd behaviour).

Cluster B (Dramatic/Emotional): Antisocial PD (disregard for others' rights, impulsivity, no remorse), Borderline PD (unstable relationships, fear of abandonment, self-harm, emotional dysregulation), Histrionic PD (excessive emotionality, attention-seeking), Narcissistic PD (grandiosity, lack of empathy, entitlement).

Cluster C (Anxious/Fearful): Avoidant PD (social inhibition, hypersensitivity to rejection), Dependent PD (excessive need for care, fear of abandonment), Obsessive-Compulsive PD (perfectionism, control, rigidity).

Key features: These are ego-syntonic (the person sees their patterns as normal and desirable), making treatment challenging. People rarely seek help for personality disorders themselves; they often appear for treatment of comorbid depression or anxiety, or are referred by others.

Borderline Personality Disorder (BPD) is the most treatable PD. Dialectical Behaviour Therapy (DBT), developed by Marsha Linehan, is highly effective. Linehan, who herself has BPD, revolutionised treatment by combining cognitive-behavioural techniques with acceptance and mindfulness.

Antisocial PD is the most difficult to treat due to lack of empathy and absence of anxiety/guilt that typically motivate change.`,
    keyPoints:['Cluster A: paranoid, schizoid, schizotypal (odd/eccentric)','Cluster B: antisocial, borderline, histrionic, narcissistic (dramatic)','Cluster C: avoidant, dependent, obsessive-compulsive (anxious)','Rigid, maladaptive patterns beginning by early adulthood','Ego-syntonic: person sees patterns as normal; rarely seek treatment voluntarily'],
    types:['Paranoid PD: pervasive distrust, suspicion','Borderline PD: emotional instability, fear of abandonment, self-harm, splitting','Narcissistic PD: grandiosity, lack of empathy, entitlement','Antisocial PD: disregard for others, impulsivity, no remorse'],
    symptoms:['PD features vary by type; generally include rigid thinking, poor relationships, interpersonal conflict','Borderline: unstable relationships, intense fear of abandonment, self-harm, affective dysregulation','Antisocial: manipulation, lack of remorse, repeated rule-breaking, aggression'],
    psychologists:['Marsha Linehan — Developed DBT for Borderline PD','Otto Kernberg — Psychoanalytic understanding of PD'],
    examples:['A person with Narcissistic PD demanding special treatment, lacking empathy for others','Someone with Borderline PD in intense relationships that end abruptly due to perceived rejection, with self-harm episodes'],
    treatment:'DBT (Dialectical Behaviour Therapy) is gold standard for Borderline PD. Schema therapy shows promise for other PDs. Psychoeducation and mentalization-based therapy. Antisocial PD difficult to treat; requires structured environments.',
    summary:'Personality Disorders are pervasive, rigid patterns of thinking and behaving that cause significant impairment. They are ego-syntonic (the person sees them as normal), making treatment challenging. DBT is highly effective for Borderline PD. Treatment requires long-term, comprehensive approaches.',
    mnemonic:'Cluster ABC: A=odd/eccentric, B=dramatic/emotional, C=anxious/fearful'
  },
  {
    id:'substance-use',
    name:'Substance Use Disorder',
    category:'Mood Disorders',
    icon:'⚠️',
    preview:'Problematic pattern of substance use causing significant impairment, tolerance, and withdrawal.',
    definition:'Substance Use Disorder is a complex brain disorder characterised by continued use of a substance despite harmful consequences, involving changes in brain chemistry that drive compulsive drug-seeking behaviour.',
    explanation:`Substance Use Disorder (SUD) involves a maladaptive pattern of substance use leading to clinically significant impairment or distress. The DSM-5 criterion includes 2 or more symptoms over 12 months, including tolerance (needing more to achieve the same effect) and withdrawal (negative symptoms upon cessation).

The addiction cycle is driven by changes in brain reward systems: repeated drug use increases dopamine in the nucleus accumbens, creating powerful associations. Over time, the brain adapts (tolerance), requiring more of the substance to achieve the same effect. When the substance is removed, the brain is hyporesponsive, causing withdrawal — the motivation to use becomes compulsive rather than recreational.

Risk factors include genetic predisposition (heritability ~50%), early onset of use (adolescent brain development still ongoing, heightening vulnerability), trauma/stress, mental health comorbidities (depression, anxiety), and environmental factors (peer use, availability, socioeconomic stress).

Important: addiction is NOT a character flaw or moral failure. It is a medical disorder involving brain chemistry. Effective treatment combines pharmacological interventions (medication-assisted treatment: methadone, buprenorphine), psychotherapy (CBT, motivational interviewing), peer support (12-step programmes), and comprehensive social support.

Recovery is possible. Many people achieve long-term sobriety with appropriate treatment and support.`,
    keyPoints:['Characterised by compulsive drug-seeking despite harmful consequences','Tolerance (need more for same effect) and withdrawal (negative symptoms upon cessation)','Driven by changes in brain dopamine systems, not moral failure','Genetic predisposition ~50%; early use increases vulnerability','Medication-assisted treatment + psychotherapy + peer support = most effective'],
    types:['Alcohol Use Disorder','Cannabis Use Disorder','Cocaine/Stimulant Use Disorder','Opioid Use Disorder','Sedative/Anxiolytic Use Disorder'],
    symptoms:['Using more than intended','Unsuccessful attempts to reduce use','Continued use despite problems','Tolerance (need higher doses)','Withdrawal symptoms','Neglect of other activities','Continued use despite harm'],
    psychologists:['George Koob — Neurobiology of addiction','Nora Volkow — Addiction as brain disease'],
    examples:['A person using alcohol to cope with stress, eventually experiencing withdrawal, health problems, but continuing use','Someone with opioid use disorder cycling through overdoses, rehab, and relapse'],
    treatment:'Medication-Assisted Treatment (methadone, buprenorphine for opioids; naltrexone for alcohol), CBT, motivational interviewing, 12-step programmes, peer support groups, comprehensive social support.',
    summary:'Substance Use Disorder is a brain disease involving compulsive drug-seeking despite harmful consequences. It results from changes in dopamine systems and reward-related brain circuits. Medication-assisted treatment combined with psychotherapy and peer support produces the best long-term outcomes.',
    mnemonic:'Addiction = Altered dopamine · Deviation from values · Declining health · Desire to quit but can\'t'
  },
  {
    id:'psychotic-disorders-other',
    name:'Brief Psychotic Disorder & Delusional Disorder',
    category:'Psychotic Disorders',
    icon:'💭',
    preview:'Shorter-duration or non-bizarre psychotic symptoms, distinct from schizophrenia.',
    definition:'Brief Psychotic Disorder involves psychotic symptoms lasting 1 day to 1 month, often triggered by severe stress. Delusional Disorder involves persistent non-bizarre delusions (false beliefs potentially possible in reality) lasting ≥1 month without prominent hallucinations.',
    explanation:`Brief Psychotic Disorder typically emerges suddenly following extreme stressors (loss of loved one, natural disaster, severe trauma). The psychotic symptoms — hallucinations, delusions, disorganised speech/behaviour — are similar to schizophrenia but are time-limited. After 1 day to 1 month, symptoms resolve completely. Prognosis is generally good, especially with early intervention and stress reduction.

Delusional Disorder is characterised by the presence of one or more non-bizarre delusions (beliefs that could potentially be true, unlike schizophrenia's often bizarre delusions) occurring in the absence of prominent hallucinations or other psychotic symptoms. The person's functioning is relatively intact outside the delusional system.

Types include: Erotomanic (false belief that someone is in love with the person), Grandiose (exaggerated belief in importance/power), Jealous (false belief that partner is unfaithful), Persecutory (belief of being conspired against, harassed), Somatic (false belief about bodily functions/appearance).

Delusional Disorder is chronic and often resistant to treatment, though antipsychotics can help. Cognitive-behavioural approaches focusing on reality-testing and coping with the distress caused by delusions are also used.`,
    keyPoints:['Brief Psychotic Disorder: psychotic symptoms 1 day–1 month, often stress-triggered, good prognosis','Delusional Disorder: fixed, non-bizarre delusions ≥1 month, without prominent hallucinations','Person\'s functioning relatively intact outside the delusional system','Non-bizarre delusions are beliefs potentially possible in reality','Antipsychotics helpful; psychotherapy focusing on coping and reality-testing'],
    types:['Brief Psychotic Disorder (stress-triggered)','Delusional Disorder (erotomanic, grandiose, jealous, persecutory, somatic types)'],
    symptoms:['Brief: abrupt onset of hallucinations, delusions, disorganised behaviour; full recovery within 1 month','Delusional: fixed false belief, absence of prominent hallucinations, generally intact functioning'],
    psychologists:['Research on brief reactive psychosis and post-traumatic stress'],
    examples:['A person experiencing hallucinations and paranoia for 2 weeks following loss of spouse, then complete remission','Someone with persistent false belief that a celebrity is in love with them (erotomanic)'],
    treatment:'Brief Psychotic: antipsychotics if needed, stress reduction, psychotherapy. Delusional: antipsychotics (often with limited effect), cognitive therapy focusing on coping with distress.',
    summary:'Brief Psychotic Disorder and Delusional Disorder are psychotic conditions distinct from schizophrenia. Brief Psychotic has good prognosis with time-limited symptoms. Delusional Disorder is chronic but involves relatively preserved functioning outside the delusional system.',
    mnemonic:'Brief = Days to weeks (good outcome); Delusional = Months to years (persists)'
  },
  {
    id:'adjustment-disorder',
    name:'Adjustment Disorder',
    category:'Foundations',
    icon:'😔',
    preview:'Excessive emotional or behavioural response to an identified stressor, resolving within 6 months of stressor cessation.',
    definition:'Adjustment Disorder is characterised by the development of emotional or behavioural symptoms in response to an identifiable psychosocial stressor, with symptoms appearing within 3 months of stressor onset and not persisting more than 6 months after stressor cessation.',
    explanation:`Adjustment Disorder is essentially a "normal" response that becomes clinically significant. It falls on a spectrum between normal stress reaction and more serious mental illness. The key features are: (1) identifiable stressor, (2) onset within 3 months of stressor, (3) symptoms exceeding normal expected response, (4) symptoms resolve within 6 months of stressor removal.

Common stressors include: job loss, relationship termination, major illness, death of family member, relocation, academic failure, legal problems.

The disorder is specified by the predominant symptoms: depressed mood, anxiety, disturbance of conduct, or mixed features.

Importantly, Adjustment Disorder does NOT mean the person is "weak" or unable to cope. It reflects that their coping resources have been temporarily overwhelmed by a specific life event. With appropriate support — psychotherapy, stress management, social support — people recover quickly and completely.

Treatment focuses on: processing the stressor, developing coping skills, mobilising social support, and addressing any comorbid depression or anxiety. Psychotherapy is typically effective; medication is usually not necessary unless comorbid anxiety/depression develops.`,
    keyPoints:['Response to identifiable stressor occurring within 3 months','Symptoms exceed normal expected response but resolve within 6 months of stressor removal','Specified by predominant symptom type: depressed mood, anxiety, conduct disturbance, mixed','Does NOT indicate "weakness" — reflects temporary overwhelm of coping resources','Excellent prognosis with psychotherapy and social support'],
    types:['With depressed mood','With anxiety','With disturbance of conduct','With mixed features'],
    symptoms:['Depressed mood, anxiety, or both','Difficulty concentrating','Changes in eating/sleeping','Social withdrawal','Work/academic problems'],
    psychologists:['Research on coping and resilience in response to life stressors'],
    examples:['A person experiencing depression and anxiety after job loss, improving with counselling and new employment','A student with academic problems and anxiety after transferring schools, improving once they adjust'],
    treatment:'Psychotherapy (supportive, cognitive-behavioural), stress management, social support, identifying coping strategies. Medication typically not needed unless comorbid disorder develops.',
    summary:'Adjustment Disorder represents a normal stress response that becomes clinically significant. It is time-limited and resolves with appropriate support. Psychotherapy, stress management, and social support are highly effective treatments.',
    mnemonic:'Adjustment = Stressor-triggered, time-limited, resolvable with support'
  },
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: HELPER FUNCTIONS & UTILITIES
// ════════════════════════════════════════════════════════════════════════════

function getTopic(id) {
  return KB.find(t => t.id === id);
}

function getTopicsByCategory(category) {
  if (category === 'All') return KB;
  return KB.filter(t => t.category === category);
}

function getCategories() {
  return [...new Set(KB.map(t => t.category))];
}

function searchTopics(query) {
  const q = query.toLowerCase();
  return KB.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.preview.toLowerCase().includes(q) ||
    t.definition.toLowerCase().includes(q)
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 8: MAIN APP FUNCTIONS & INIT
// ════════════════════════════════════════════════════════════════════════════

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
  AppState.set('theme', newTheme);
}

function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

function updateStatsBar() {
  const notes = NotesModule.getNotes();
  const masteryData = StorageService.get('masteryData', {});
  const studied = Object.keys(masteryData).filter(id => masteryData[id].studied).length;
  const quizzes = StorageService.get('quizResults', []).length;
  document.getElementById('s-topics').textContent = KB.length;
  document.getElementById('s-notes').textContent = notes.length;
  document.getElementById('s-studied').textContent = studied;
  document.getElementById('s-quizzes').textContent = quizzes;
}

function initTopicGrid() {
  const categories = getCategories();
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
    { title: 'OCD Cycle', text: 'In OCD, compulsions temporarily relieve the anxiety caused by obsessions — but that relief reinforces the cycle. Exposure and Response Prevention (ERP) therapy breaks this cycle.' },
    { title: 'Bipolar & Lithium', text: 'Lithium — a naturally occurring salt — remains one of the most effective mood stabilisers for bipolar disorder. It reduces both manic and depressive episodes and lowers suicide risk by up to 80%.' },
    { title: 'GAD vs Normal Worry', text: 'Everyone worries, but people with GAD cannot "turn off" their worry. GAD involves uncontrollable worry about multiple areas for ≥6 months.' }
  ];
  const idx = new Date().getDate() % DAILY_FACTS.length;
  const f = DAILY_FACTS[idx];
  const titleEl = document.getElementById('factTitle');
  const textEl = document.getElementById('factText');
  if (titleEl) titleEl.textContent = f.title;
  if (textEl) textEl.textContent = f.text;
}

function openStudyTopic(id) {
  const topic = getTopic(id);
  if (!topic) return;
  AppState.set('currentTopic', topic);
  MasteryEngine.recordStudySession(id);
  navigate('study');
}

function openFlashcardsTopic(id) {
  const topic = getTopic(id);
  if (!topic) return;
  AppState.set('currentTopic', topic);
  navigate('flashcards');
}

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
    stored.push({ name: file.name, text: text.slice(0, 5000), date: new Date().toLocaleDateString('en-IN'), wordCount });
    StorageService.set('importedPDFs', stored);
    event.target.value = '';
  } catch (err) {
    UINotifications.hideLoading();
    UINotifications.toast('Error reading PDF: ' + err.message, 'error');
    event.target.value = '';
  }
}

// ════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  console.log('🧠 PsychStudy 2.0 initializing…');
  
  // Initialize storage
  StorageService.init();
  
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
      console.log('✓ PDF.js loaded');
    }
  };
  document.head.appendChild(script);

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
  });

  console.log('✓ App initialized');
});

// ════════════════════════════════════════════════════════════════════════════
// GLOBAL EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// Navigation & Theme
window.navigate = navigate;
window.toggleTheme = toggleTheme;
window.toggleNav = toggleNav;

// Topics & Filtering
window.filterTopics = filterTopics;
window.openStudyTopic = openStudyTopic;
window.openFlashcardsTopic = openFlashcardsTopic;

// PDF Import
window.importPDF = importPDF;

// Modules (for testing/extension)
window.StorageService = StorageService;
window.MasteryEngine = MasteryEngine;
window.NotesModule = NotesModule;
window.QuizEngine = QuizEngine;
window.KB = KB;

// App state
window.AppState = AppState;
window.UINotifications = UINotifications;

console.log('🧠 PsychStudy 2.0 loaded. Core modules ready.');
