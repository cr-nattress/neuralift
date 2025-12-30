import OpenAI from 'openai';
import { BaseLLMProvider, estimateTokens } from './base.js';
import type {
  GenerateOptions,
  GenerateResult,
  ProviderPricing,
  LLMProviderName,
} from '../types/llm.js';
import { MODEL_PRICING, DEFAULT_MODELS } from '../types/llm.js';

/**
 * OpenAI LLM Provider
 */
export class OpenAIProvider extends BaseLLMProvider {
  readonly name: LLMProviderName = 'openai';
  readonly defaultModel: string = DEFAULT_MODELS.openai;

  private client: OpenAI;

  constructor(apiKey: string) {
    super(apiKey);
    this.client = new OpenAI({ apiKey });
  }

  protected async doGenerate(
    prompt: string,
    options: GenerateOptions = {}
  ): Promise<GenerateResult> {
    const model = options.model || this.defaultModel;

    const messages: OpenAI.ChatCompletionMessageParam[] = [];

    if (options.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const response = await this.client.chat.completions.create({
      model,
      messages,
      max_tokens: options.maxTokens,
      temperature: options.temperature,
      stop: options.stopSequences,
    });

    const content = response.choices[0]?.message?.content || '';
    const usage = response.usage || {
      prompt_tokens: estimateTokens(prompt),
      completion_tokens: estimateTokens(content),
      total_tokens: 0,
    };

    const tokenUsage = {
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens || usage.prompt_tokens + usage.completion_tokens,
    };

    return {
      content,
      model,
      usage: tokenUsage,
      estimatedCost: this.estimateCost(tokenUsage.promptTokens, tokenUsage.completionTokens),
      provider: this.name,
    };
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      // Make a minimal API call to verify the key works
      await this.client.models.list();
      return true;
    } catch {
      return false;
    }
  }

  getPricing(model?: string): ProviderPricing {
    const modelName = model || this.defaultModel;
    return MODEL_PRICING[modelName] || MODEL_PRICING['gpt-4o-mini'];
  }
}
