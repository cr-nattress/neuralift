# Story 07-002: LLM Provider Abstraction

## Story

**As a** developer
**I want** a unified interface for multiple LLM providers
**So that** I can easily switch between OpenAI, Anthropic, and Gemini

## Points: 8

## Priority: Critical

## Status: DONE

## Description

Create an abstraction layer that allows the CLI to work with multiple LLM providers (OpenAI, Anthropic, Google Gemini) through a common interface. This enables flexibility in choosing providers and easy addition of new ones.

## Acceptance Criteria

- [ ] Common LLM interface defined
- [ ] OpenAI provider implemented
- [ ] Anthropic provider implemented
- [ ] Google Gemini provider implemented
- [ ] Provider selection via configuration/flag
- [ ] Graceful fallback if provider unavailable
- [ ] Rate limiting and retry logic
- [ ] Cost tracking per request

## Technical Details

### Provider Interface

```typescript
interface LLMProvider {
  name: string;

  // Text generation
  generate(prompt: string, options?: GenerateOptions): Promise<string>;

  // Streaming (optional)
  stream?(prompt: string, options?: GenerateOptions): AsyncIterable<string>;

  // Check if provider is available
  isAvailable(): Promise<boolean>;

  // Get estimated cost for a request
  estimateCost(tokens: number): number;
}

interface GenerateOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}
```

### Dependencies

```bash
npm install openai @anthropic-ai/sdk @google/generative-ai
```

### Configuration

```typescript
// config.ts
export const LLM_CONFIG = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    defaultModel: 'gpt-4-turbo-preview',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    defaultModel: 'claude-3-sonnet-20240229',
  },
  gemini: {
    apiKey: process.env.GOOGLE_AI_API_KEY,
    defaultModel: 'gemini-pro',
  },
};
```

## Tasks

- [ ] Define LLMProvider interface
- [ ] Implement OpenAI provider
- [ ] Implement Anthropic provider
- [ ] Implement Gemini provider
- [ ] Create provider factory/registry
- [ ] Add CLI flag for provider selection
- [ ] Implement retry logic with exponential backoff
- [ ] Add request/token tracking
- [ ] Write unit tests for each provider
- [ ] Document provider setup in README

## Notes

- Each provider has different token limits and pricing
- Consider caching responses for identical prompts
- Log all LLM interactions for debugging
