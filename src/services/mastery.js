/**
 * Mastery Engine — Local, deterministic learning analytics
 * Tracks topic mastery, generates recommendations, no AI/backend
 */

import { storageService } from './storage.js';

class MasteryEngine {
  constructor() {
    this.storage = storageService;
  }

  /**
   * Get or create mastery record for a topic
   */
  getTopicMastery(topicId) {
    const masteryData = this.storage.get('masteryData', {});
    if (!masteryData[topicId]) {
      masteryData[topicId] = {
        topicId,
        studied: false,
        studiedDates: [],
        quizAttempts: [],
        totalCorrect: 0,
        totalAttempts: 0,
        accuracy: 0,
        confidenceLevel: 0, // 0-100 based on performance
        lastStudied: null,
        createdAt: new Date().toISOString()
      };
      this.storage.set('masteryData', masteryData);
    }
    return masteryData[topicId];
  }

  /**
   * Record a study session
   */
  recordStudySession(topicId) {
    const masteryData = this.storage.get('masteryData', {});
    if (!masteryData[topicId]) {
      masteryData[topicId] = this.getTopicMastery(topicId);
    }
    
    const record = masteryData[topicId];
    record.studied = true;
    record.studiedDates.push(new Date().toISOString());
    record.lastStudied = new Date().toISOString();
    
    this.storage.set('masteryData', masteryData);
  }

  /**
   * Record quiz attempt and update mastery
   */
  recordQuizAttempt(topicId, score, totalQuestions) {
    const masteryData = this.storage.get('masteryData', {});
    if (!masteryData[topicId]) {
      masteryData[topicId] = this.getTopicMastery(topicId);
    }

    const record = masteryData[topicId];
    const accuracy = Math.round((score / totalQuestions) * 100);
    
    record.quizAttempts.push({
      score,
      totalQuestions,
      accuracy,
      timestamp: new Date().toISOString()
    });

    record.totalCorrect += score;
    record.totalAttempts += totalQuestions;
    record.accuracy = Math.round((record.totalCorrect / record.totalAttempts) * 100);
    
    // Confidence: based on recent accuracy (last 3 attempts)
    const recentAttempts = record.quizAttempts.slice(-3);
    record.confidenceLevel = Math.round(
      recentAttempts.reduce((sum, a) => sum + a.accuracy, 0) / recentAttempts.length
    );

    this.storage.set('masteryData', masteryData);
    
    return record;
  }

  /**
   * Get topics by mastery level
   */
  getTopicsByMastery(topics) {
    const masteryData = this.storage.get('masteryData', {});
    
    const withMastery = topics.map(topic => {
      const mastery = masteryData[topic.id] || this.getTopicMastery(topic.id);
      return {
        ...topic,
        mastery: {
          studied: mastery.studied,
          accuracy: mastery.accuracy,
          confidenceLevel: mastery.confidenceLevel,
          lastStudied: mastery.lastStudied,
          level: this.getMasteryLevel(mastery)
        }
      };
    });

    return withMastery.sort((a, b) => {
      // Sort by: not studied > weak > medium > strong
      const levelOrder = { notStarted: 0, weak: 1, medium: 2, strong: 3 };
      return levelOrder[a.mastery.level] - levelOrder[b.mastery.level];
    });
  }

  /**
   * Determine mastery level for a topic
   */
  getMasteryLevel(masteryRecord) {
    if (!masteryRecord.studied) return 'notStarted';
    if (masteryRecord.accuracy === 0) return 'notStarted';
    if (masteryRecord.accuracy < 50) return 'weak';
    if (masteryRecord.accuracy < 80) return 'medium';
    return 'strong';
  }

  /**
   * Get weak topics for review
   */
  getWeakTopics(topics) {
    const masteryData = this.storage.get('masteryData', {});
    
    return topics.filter(topic => {
      const mastery = masteryData[topic.id];
      if (!mastery || !mastery.studied) return false;
      return mastery.accuracy < 70; // Accuracy below 70% is weak
    }).sort((a, b) => {
      const masteryA = masteryData[a.id];
      const masteryB = masteryData[b.id];
      return masteryA.accuracy - masteryB.accuracy; // Worst first
    });
  }

  /**
   * Get strong topics (mastered)
   */
  getStrongTopics(topics) {
    const masteryData = this.storage.get('masteryData', {});
    
    return topics.filter(topic => {
      const mastery = masteryData[topic.id];
      if (!mastery || !mastery.studied) return false;
      return mastery.accuracy >= 80;
    }).sort((a, b) => {
      const masteryA = masteryData[a.id];
      const masteryB = masteryData[b.id];
      return masteryB.accuracy - masteryA.accuracy; // Best first
    });
  }

  /**
   * Get recommended next topic to study
   */
  getRecommendedTopic(topics) {
    const masteryData = this.storage.get('masteryData', {});
    
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
    if (medium) return medium;

    return topics[0];
  }

  /**
   * Get study stats summary
   */
  getStudyStats(topics) {
    const masteryData = this.storage.get('masteryData', {});
    
    const studied = topics.filter(t => masteryData[t.id]?.studied).length;
    const strong = topics.filter(t => {
      const m = masteryData[t.id];
      return m && m.accuracy >= 80;
    }).length;
    const weak = this.getWeakTopics(topics).length;
    
    return {
      total: topics.length,
      studied,
      strong,
      weak,
      remaining: topics.length - studied,
      averageAccuracy: this.calculateAverageAccuracy(topics),
      totalQuizzes: Object.values(masteryData).reduce((sum, m) => sum + m.quizAttempts.length, 0)
    };
  }

  /**
   * Calculate average accuracy across studied topics
   */
  calculateAverageAccuracy(topics) {
    const masteryData = this.storage.get('masteryData', {});
    const studied = topics.filter(t => masteryData[t.id]?.studied && masteryData[t.id]?.accuracy > 0);
    
    if (studied.length === 0) return 0;
    
    const sum = studied.reduce((acc, t) => acc + masteryData[t.id].accuracy, 0);
    return Math.round(sum / studied.length);
  }

  /**
   * Get learning streak
   */
  getStudyStreak() {
    const masteryData = this.storage.get('masteryData', {});
    const dates = [];
    
    // Collect all study dates
    Object.values(masteryData).forEach(m => {
      dates.push(...m.studiedDates);
    });

    if (dates.length === 0) return 0;

    // Sort dates descending
    dates.sort((a, b) => new Date(b) - new Date(a));

    // Count consecutive days from today
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
}

export const masteryEngine = new MasteryEngine();
