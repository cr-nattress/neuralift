/**
 * GetRecommendations Use Case
 *
 * Generates personalized training recommendations.
 */

// Placeholder - will be implemented in Epic 03
export interface RecommendationOutput {
  suggestedLevel: string;
  message: string;
}

export interface GetRecommendations {
  execute(): Promise<RecommendationOutput>;
}
