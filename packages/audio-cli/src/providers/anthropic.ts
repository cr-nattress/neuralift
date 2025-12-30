import Anthropic from '@anthropic-ai/sdk';
import { BaseLLMProvider } from './base.js';
import type {
  GenerateOptions,
  GenerateResult,
  ProviderPricing,
  LLMProviderName,
} from '../types/llm.js';
import { MODEL_PRICING, DEFAULT_MODELS } from '../types/llm.js';

/**
 * Anthropic (Claude) LLM Provider
 */
export class AnthropicProvider extends BaseLLMProvider {
  readonly name: LLMProviderName = 'anthropic';
  readonly defaultModel: string = DEFAULT_MODELS.anthropic;

  private client: Anthropic;

  constructor(apiKey: string) {
    super(apiKey);
    this.client = new Anthropic({ apiKey });
  }

  protected async doGenerate(
    prompt: string,
    options: GenerateOptions = {}
  ): Promise<GenerateResult> {
    const model = options.model || this.defaultModel;

    const response = await this.client.messages.create({
      model,
      max_tokens: options.maxTokens || 1024,
      system: options.systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      stop_sequences: options.stopSequences,
      temperature: options.temperature,
    });

    // Extract text from content blocks
    const content = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');

    const tokenUsage = {
      promptTokens: response.usage.input_tokens,
      completionTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens,
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
      await this.client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'Hi' }],
      });
      return true;
    } catch {
      return false;
    }
  }

  getPricing(model?: string): ProviderPricing {
    const modelName = model || this.defaultModel;
    return MODEL_PRICING[modelName] || MODEL_PRICING['claude-3-5-sonnet-20241022'];
  }
}
