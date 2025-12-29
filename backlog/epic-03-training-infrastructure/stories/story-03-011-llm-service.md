# Story 03-011: Implement LLM Service

## Story

**As a** developer
**I want** an LLM service adapter
**So that** personalized feedback is generated from user profiles

## Points: 8

## Priority: High

## Status: TODO

## Description

Implement the ILLMService port interface using Anthropic Claude API to generate personalized session feedback, recommendations, and motivational messages.

## Acceptance Criteria

- [ ] Implements ILLMService interface
- [ ] Generates session feedback from results and profile
- [ ] Generates personalized recommendations
- [ ] Generates motivational messages
- [ ] Handles API errors gracefully
- [ ] Falls back to static messages on failure
- [ ] Respects rate limits

## Technical Details

### AnthropicLLMService

```typescript
// src/infrastructure/llm/AnthropicLLMService.ts
import type { ILLMService, LLMFeedbackResponse, SessionResult, UserBehavioralProfile } from '@neuralift/core';

export class AnthropicLLMService implements ILLMService {
  private apiEndpoint: string;

  constructor(apiEndpoint: string = '/api/llm') {
    this.apiEndpoint = apiEndpoint;
  }

  async getSessionFeedback(
    session: SessionResult,
    profile: UserBehavioralProfile
  ): Promise<LLMFeedbackResponse> {
    try {
      const prompt = this.buildSessionFeedbackPrompt(session, profile);
      const response = await this.callLLM(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('LLM session feedback failed:', error);
      return this.getFallbackSessionFeedback(session);
    }
  }

  async getRecommendations(
    profile: UserBehavioralProfile
  ): Promise<LLMFeedbackResponse> {
    try {
      const prompt = this.buildRecommendationsPrompt(profile);
      const response = await this.callLLM(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('LLM recommendations failed:', error);
      return this.getFallbackRecommendations(profile);
    }
  }

  async getMotivationalMessage(
    profile: UserBehavioralProfile,
    trigger: string
  ): Promise<string> {
    try {
      const prompt = this.buildMotivationalPrompt(profile, trigger);
      const response = await this.callLLM(prompt);
      return response.trim();
    } catch (error) {
      console.error('LLM motivational message failed:', error);
      return this.getFallbackMotivational(trigger);
    }
  }

  private async callLLM(prompt: string): Promise<string> {
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    return data.message;
  }

  private buildSessionFeedbackPrompt(
    session: SessionResult,
    profile: UserBehavioralProfile
  ): string {
    return `You are a supportive cognitive training coach. Analyze this training session and provide personalized feedback.

SESSION RESULTS:
- Level: ${session.levelId}
- Combined Accuracy: ${(session.combinedAccuracy * 100).toFixed(1)}%
- Position Accuracy: ${(session.positionStats.accuracy * 100).toFixed(1)}%
- Audio Accuracy: ${(session.audioStats.accuracy * 100).toFixed(1)}%
- Position D-Prime: ${session.positionStats.dPrime}
- Audio D-Prime: ${session.audioStats.dPrime}
- Duration: ${Math.round(session.duration / 1000)}s

USER PROFILE:
- Average Accuracy: ${(profile.performance.averageAccuracy * 100).toFixed(1)}%
- Accuracy Trend: ${profile.performance.accuracyTrend}
- Current Streak: ${profile.engagement.currentStreak} days
- Total Sessions: ${profile.engagement.totalSessions}
- Position Strength: ${(profile.performance.positionStrength * 100).toFixed(0)}%
- Audio Strength: ${(profile.performance.audioStrength * 100).toFixed(0)}%

Provide:
1. A brief (1-2 sentences) personalized assessment of this session
2. One specific suggestion for improvement
3. An encouraging closing statement

Keep the tone warm, supportive, and scientifically grounded. Response should be under 150 words.`;
  }

  private buildRecommendationsPrompt(profile: UserBehavioralProfile): string {
    return `You are a cognitive training advisor. Based on this user's profile, provide training recommendations.

USER PROFILE:
${JSON.stringify(profile, null, 2)}

Provide:
1. Recommended next training level or focus area
2. Optimal session frequency recommendation
3. One technique to try in the next session

Keep recommendations specific and actionable. Under 100 words.`;
  }

  private buildMotivationalPrompt(
    profile: UserBehavioralProfile,
    trigger: string
  ): string {
    return `Generate a brief motivational message for a cognitive training user.

Context: ${trigger}
Current Streak: ${profile.engagement.currentStreak} days
Sessions This Week: ${profile.engagement.sessionsThisWeek}
Accuracy Trend: ${profile.performance.accuracyTrend}

Write one encouraging sentence (under 20 words) appropriate for the context.`;
  }

  private parseResponse(response: string): LLMFeedbackResponse {
    // Simple parsing - in production, use structured output
    return {
      message: response,
      suggestions: [],
      encouragement: '',
      nextSteps: [],
    };
  }

  // Fallback methods for when API fails
  private getFallbackSessionFeedback(session: SessionResult): LLMFeedbackResponse {
    const accuracy = session.combinedAccuracy;
    let message = '';

    if (accuracy >= 0.85) {
      message = "Excellent session! You're demonstrating strong working memory skills.";
    } else if (accuracy >= 0.70) {
      message = "Good session! You're making solid progress with your training.";
    } else if (accuracy >= 0.50) {
      message = "Keep at it! Every session strengthens your cognitive abilities.";
    } else {
      message = "Training is challenging—that's how growth happens. Stay consistent!";
    }

    return {
      message,
      suggestions: ["Focus on one modality at a time if feeling overwhelmed"],
      encouragement: "Every session counts toward building stronger neural pathways.",
    };
  }

  private getFallbackRecommendations(profile: UserBehavioralProfile): LLMFeedbackResponse {
    return {
      message: "Continue with your current training level for now.",
      suggestions: ["Aim for 70-85% accuracy before advancing"],
      nextSteps: ["Complete 3 more sessions at this level"],
    };
  }

  private getFallbackMotivational(trigger: string): string {
    const messages: Record<string, string> = {
      'session_start': "Let's train those neurons!",
      'streak_milestone': "Amazing streak! Your consistency is paying off.",
      'level_unlock': "New level unlocked! Ready for the challenge?",
      'default': "Every session makes a difference!",
    };
    return messages[trigger] ?? messages['default'];
  }
}
```

### API Route

```typescript
// src/app/api/llm/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Fast and cost-effective
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return NextResponse.json({ message: content.text });
  } catch (error) {
    console.error('LLM API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
```

## Tasks

- [ ] Create src/infrastructure/llm/AnthropicLLMService.ts
- [ ] Implement all ILLMService methods
- [ ] Create prompt templates
- [ ] Implement fallback responses
- [ ] Create API route for Claude
- [ ] Install @anthropic-ai/sdk
- [ ] Test with mock profile data
- [ ] Handle rate limits and errors

## Dependencies

- Story 01-005 (Port Interfaces)
- Story 03-010 (Profile Builder)

## Notes

- Uses Claude Haiku for cost efficiency
- API key stored in environment variables
- Fallbacks ensure app works without API
- Prompts should be tuned based on user feedback
