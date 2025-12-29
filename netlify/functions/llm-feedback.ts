/**
 * Netlify Function: llm-feedback
 *
 * Handles LLM-powered personalized feedback generation using Anthropic Claude API.
 * Provides session feedback, training recommendations, and motivational messages.
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// Types
interface SessionResult {
  sessionId: string;
  levelId: string;
  mode: string;
  nBack: number;
  timestamp: string;
  duration: number;
  trials: unknown[];
  positionStats: PerformanceStats;
  audioStats: PerformanceStats;
  combinedAccuracy: number;
  completed: boolean;
}

interface PerformanceStats {
  hits: number;
  misses: number;
  falseAlarms: number;
  correctRejections: number;
  hitRate: number;
  falseAlarmRate: number;
  dPrime: number;
  accuracy: number;
  avgResponseTime: number | null;
}

interface UserProfile {
  id: string;
  currentLevel: number;
  totalSessions: number;
  totalTrainingTime: number;
  currentStreak: number;
  longestStreak: number;
  preferences: {
    preferredTimeOfDay: string | null;
    averageSessionDuration: number;
    preferredMode: string | null;
    sessionsPerWeek: number;
  };
  trends: {
    overallTrend: string;
    positionTrend: string;
    audioTrend: string;
    recentAccuracies: number[];
  };
  strengthsWeaknesses: {
    strongerModality: string;
    consistentlyStrugglesAt: number | null;
    consistentlyExcelsAt: number | null;
  };
}

interface RequestBody {
  action: 'session-feedback' | 'recommendations' | 'motivation' | 'health-check';
  session?: SessionResult;
  profile?: UserProfile;
}

interface LLMFeedbackResponse {
  feedback: string;
  recommendations: string[];
  encouragement: string;
  focusAreas: string[];
}

// Prompt templates
function buildSessionFeedbackPrompt(session: SessionResult, profile: UserProfile): string {
  return `You are a supportive cognitive training coach analyzing a dual n-back training session. Provide personalized feedback in a warm, encouraging tone.

SESSION RESULTS:
- Level: ${session.levelId} (${session.nBack}-back)
- Mode: ${session.mode}
- Combined Accuracy: ${session.combinedAccuracy.toFixed(1)}%
- Position Accuracy: ${session.positionStats.accuracy.toFixed(1)}%
- Audio Accuracy: ${session.audioStats.accuracy.toFixed(1)}%
- Position D-Prime: ${session.positionStats.dPrime.toFixed(2)}
- Audio D-Prime: ${session.audioStats.dPrime.toFixed(2)}
- Duration: ${Math.round(session.duration / 1000)} seconds
- False Alarm Rate (Position): ${(session.positionStats.falseAlarmRate * 100).toFixed(1)}%
- False Alarm Rate (Audio): ${(session.audioStats.falseAlarmRate * 100).toFixed(1)}%

USER PROFILE:
- Current Streak: ${profile.currentStreak} days
- Total Sessions: ${profile.totalSessions}
- Overall Trend: ${profile.trends.overallTrend}
- Stronger Modality: ${profile.strengthsWeaknesses.strongerModality}
- Sessions Per Week: ${profile.preferences.sessionsPerWeek.toFixed(1)}

Provide a JSON response with these fields:
- feedback: 2-3 sentences of personalized assessment (what went well, what to work on)
- recommendations: array of 2-3 specific, actionable suggestions
- encouragement: 1 motivational sentence
- focusAreas: array of 1-2 key areas to focus on next session

Keep the tone warm and scientifically grounded. Acknowledge effort regardless of accuracy.

Response format (JSON only, no markdown):
{"feedback":"...","recommendations":["...","..."],"encouragement":"...","focusAreas":["...","..."]}`;
}

function buildRecommendationsPrompt(profile: UserProfile): string {
  return `You are a cognitive training advisor. Based on this user's profile, provide training recommendations.

USER PROFILE:
- Current N-Back Level: ${profile.currentLevel}
- Total Sessions: ${profile.totalSessions}
- Current Streak: ${profile.currentStreak} days
- Longest Streak: ${profile.longestStreak} days
- Overall Trend: ${profile.trends.overallTrend}
- Stronger Modality: ${profile.strengthsWeaknesses.strongerModality}
- Average Session Duration: ${Math.round(profile.preferences.averageSessionDuration / 1000 / 60)} minutes
- Sessions Per Week: ${profile.preferences.sessionsPerWeek.toFixed(1)}
- Recent Accuracies: ${profile.trends.recentAccuracies.slice(-5).join('%, ')}%

Provide personalized training recommendations as JSON:
- recommendedLevel: suggested level ID (e.g., "dual-2", "position-3")
- reason: brief explanation why this level
- priority: 1 (highest) to 3 (lowest)

Response format (JSON array, no markdown):
{"recommendations":[{"recommendedLevel":"...","reason":"...","priority":1}]}`;
}

function buildMotivationalPrompt(profile: UserProfile): string {
  return `Generate a brief, personalized motivational message for a cognitive training user.

USER:
- Current Streak: ${profile.currentStreak} days
- Total Sessions: ${profile.totalSessions}
- Recent Trend: ${profile.trends.overallTrend}
- Training for ${Math.round(profile.totalTrainingTime / 1000 / 60)} total minutes

Write ONE encouraging sentence (15-25 words) that:
1. Acknowledges their specific progress
2. Motivates continued practice
3. Feels personal, not generic

Response (text only, no JSON):`;
}

// Call Anthropic API
async function callAnthropicAPI(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.content[0];

  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic API');
  }

  return content.text;
}

// Parse LLM response safely
function parseFeedbackResponse(response: string): LLMFeedbackResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        feedback: parsed.feedback || 'Great session! Keep practicing.',
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        encouragement: parsed.encouragement || 'Every session strengthens your mind!',
        focusAreas: Array.isArray(parsed.focusAreas) ? parsed.focusAreas : [],
      };
    }
  } catch {
    // Fall through to default
  }

  // Return default if parsing fails
  return {
    feedback: response.slice(0, 500),
    recommendations: ['Continue practicing at your current level'],
    encouragement: 'Every session counts toward building a stronger mind!',
    focusAreas: ['Consistency'],
  };
}

// Fallback responses
function getFallbackSessionFeedback(session: SessionResult): LLMFeedbackResponse {
  const accuracy = session.combinedAccuracy;

  let feedback: string;
  let encouragement: string;

  if (accuracy >= 90) {
    feedback = 'Outstanding performance! Your working memory is showing excellent results. Your accuracy demonstrates strong cognitive engagement.';
    encouragement = "You're mastering this level - consider challenging yourself with the next difficulty!";
  } else if (accuracy >= 75) {
    feedback = "Great job! You're making solid progress with your training. Your performance shows good attention and memory recall.";
    encouragement = 'Keep up the consistent practice and you\'ll see even better results!';
  } else if (accuracy >= 60) {
    feedback = 'Good effort! Every session helps build your cognitive abilities. Focus on maintaining attention throughout each trial.';
    encouragement = 'Focus on taking your time with responses - accuracy comes with practice.';
  } else {
    feedback = 'Thanks for completing this session! Working memory training is challenging - that challenge is what strengthens your brain.';
    encouragement = "Don't be discouraged - the challenge is what makes your brain stronger!";
  }

  const recommendations = [
    'Focus on maintaining attention throughout the session',
    'Take short breaks between sessions to maintain focus',
    'Practice consistently for best results',
  ];

  const focusAreas = session.positionStats.accuracy < session.audioStats.accuracy
    ? ['Position matching', 'Spatial awareness']
    : ['Audio matching', 'Auditory attention'];

  return { feedback, recommendations, encouragement, focusAreas };
}

function getFallbackRecommendations(profile: UserProfile): { recommendations: Array<{ recommendedLevel: string; reason: string; priority: number }> } {
  const recommendations = [];

  if (profile.currentLevel <= 2) {
    recommendations.push({
      recommendedLevel: 'dual-2',
      reason: 'Continue building your foundation with dual 2-back',
      priority: 1,
    });
  } else {
    recommendations.push({
      recommendedLevel: `dual-${profile.currentLevel}`,
      reason: 'Practice at your current level to maintain performance',
      priority: 1,
    });
  }

  if (profile.strengthsWeaknesses.strongerModality === 'position') {
    recommendations.push({
      recommendedLevel: 'audio-2',
      reason: 'Practice audio-only to improve your weaker modality',
      priority: 2,
    });
  } else if (profile.strengthsWeaknesses.strongerModality === 'audio') {
    recommendations.push({
      recommendedLevel: 'position-2',
      reason: 'Practice position-only to improve your weaker modality',
      priority: 2,
    });
  }

  return { recommendations };
}

function getFallbackMotivation(profile: UserProfile): string {
  if (profile.currentStreak > 7) {
    return `Amazing! You're on a ${profile.currentStreak}-day streak. Your dedication is truly impressive!`;
  } else if (profile.currentStreak > 0) {
    return `You're on a ${profile.currentStreak}-day streak! Keep the momentum going!`;
  } else if (profile.totalSessions > 10) {
    return `You've completed ${profile.totalSessions} sessions! Your commitment to brain training is paying off.`;
  } else {
    return 'Every session strengthens your working memory. Let\'s train!';
  }
}

// Main handler
const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body: RequestBody = JSON.parse(event.body || '{}');

    // Health check
    if (body.action === 'health-check') {
      const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
      return {
        statusCode: hasApiKey ? 200 : 503,
        headers,
        body: JSON.stringify({
          status: hasApiKey ? 'ok' : 'no_api_key',
          timestamp: new Date().toISOString(),
        }),
      };
    }

    // Session feedback
    if (body.action === 'session-feedback' && body.session && body.profile) {
      try {
        const prompt = buildSessionFeedbackPrompt(body.session, body.profile);
        const response = await callAnthropicAPI(prompt);
        const feedback = parseFeedbackResponse(response);
        return { statusCode: 200, headers, body: JSON.stringify(feedback) };
      } catch (error) {
        console.warn('LLM session feedback failed, using fallback:', error);
        const fallback = getFallbackSessionFeedback(body.session);
        return { statusCode: 200, headers, body: JSON.stringify(fallback) };
      }
    }

    // Recommendations
    if (body.action === 'recommendations' && body.profile) {
      try {
        const prompt = buildRecommendationsPrompt(body.profile);
        const response = await callAnthropicAPI(prompt);
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return { statusCode: 200, headers, body: jsonMatch[0] };
        }
        throw new Error('Failed to parse recommendations response');
      } catch (error) {
        console.warn('LLM recommendations failed, using fallback:', error);
        const fallback = getFallbackRecommendations(body.profile);
        return { statusCode: 200, headers, body: JSON.stringify(fallback) };
      }
    }

    // Motivation
    if (body.action === 'motivation' && body.profile) {
      try {
        const prompt = buildMotivationalPrompt(body.profile);
        const response = await callAnthropicAPI(prompt);
        return { statusCode: 200, headers, body: JSON.stringify({ motivation: response.trim() }) };
      } catch (error) {
        console.warn('LLM motivation failed, using fallback:', error);
        const fallback = getFallbackMotivation(body.profile);
        return { statusCode: 200, headers, body: JSON.stringify({ motivation: fallback }) };
      }
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid action or missing parameters' }),
    };
  } catch (error) {
    console.error('LLM function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };
