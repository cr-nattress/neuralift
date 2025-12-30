import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseLLMProvider, estimateTokens } from './base.js';
import type {
  GenerateOptions,
  GenerateResult,
  ProviderPricing,
  LLMProviderName,
} from '../types/llm.js';
import { MODEL_PRICING, DEFAULT_MODELS } from '../types/llm.js';

/**
 * Google Gemini LLM Provider
 */
export class GeminiProvider extends BaseLLMProvider {
  readonly name: LLMProviderName = 'gemini';
  readonly defaultModel: string = DEFAULT_MODELS.gemini;

  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    super(apiKey);
    this.client = new GoogleGenerativeAI(apiKey);
  }

  protected async doGenerate(
    prompt: string,
    options: GenerateOptions = {}
  ): Promise<GenerateResult> {
    const modelName = options.model || this.defaultModel;
    const model = this.client.getGenerativeModel({ model: modelName });

    // Build the full prompt with system instruction if provided
    let fullPrompt = prompt;
    if (options.systemPrompt) {
      fullPrompt = `${options.systemPrompt}\n\n${prompt}`;
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        maxOutputTokens: options.maxTokens,
        temperature: options.temperature,
        stopSequences: options.stopSequences,
      },
    });

    const response = result.response;
    const content = response.text();

    // Gemini doesn't always return token counts, so we estimate
    const usageMetadata = response.usageMetadata;
    const promptTokens = usageMetadata?.promptTokenCount || estimateTokens(fullPrompt);
    const completionTokens = usageMetadata?.candidatesTokenCount || estimateTokens(content);

    const tokenUsage = {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    };

    return {
      content,
      model: modelName,
      usage: tokenUsage,
      estimatedCost: this.estimateCost(tokenUsage.promptTokens, tokenUsage.completionTokens),
      provider: this.name,
    };
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const model = this.client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      await model.generateContent('Hi');
      return true;
    } catch {
      return false;
    }
  }

  getPricing(model?: string): ProviderPricing {
    const modelName = model || this.defaultModel;
    return MODEL_PRICING[modelName] || MODEL_PRICING['gemini-1.5-flash'];
  }
}
