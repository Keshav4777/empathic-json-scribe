export interface EmotionAnalysis {
  primary_emotion: "anger" | "sadness" | "hurt" | "fear" | "stress" | "jealousy" | "guilt" | "love" | "disappointment" | "neutral";
  secondary_emotion: string;
  intensity: number;
  explanation: string;
}

export interface ContextAnalysis {
  situation: string;
  cause: string;
  user_goal: "venting" | "reconcile" | "seek_advice" | "apology" | "breakup" | "unclear";
  risk_level: "low" | "medium" | "high";
  topic: "trust" | "communication" | "expectations" | "emotional_need" | "insecurity" | "other";
  summary: string;
}

export interface SafetyCheck {
  blocked: boolean;
  safe_reason: string;
  safe_alternative: string;
  escalation: boolean;
}

export interface MessageSuggestions {
  soft_message: string;
  honest_message: string;
  repair_message: string;
}

export interface Action {
  action_type: "small_caring_action" | "romantic_idea" | "healing_activity";
  description: string;
}

export interface IdentityGuidance {
  identity_shift_message: string;
  self_growth_affirmation: string;
}

export interface AnalysisResponse {
  emotion: EmotionAnalysis;
  context: ContextAnalysis;
  safety: SafetyCheck;
  messages: MessageSuggestions;
  actions: Action[];
  identity: IdentityGuidance;
}
