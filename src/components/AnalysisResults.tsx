import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MessageCircle, 
  Lightbulb, 
  Sparkles,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import type { AnalysisResponse } from "@/types/analysis";

interface AnalysisResultsProps {
  analysis: AnalysisResponse;
}

export const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "muted";
    }
  };

  const getEmotionColor = (emotion: string) => {
    const emotionColors: Record<string, string> = {
      anger: "destructive",
      sadness: "secondary",
      hurt: "secondary",
      fear: "secondary",
      love: "primary",
      neutral: "muted",
    };
    return emotionColors[emotion] || "muted";
  };

  return (
    <div className="space-y-6">
      {/* Emotion & Context Overview */}
      <Card className="p-6 shadow-card bg-gradient-card border-border/50">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-accent rounded-xl">
            <Heart className="w-6 h-6 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Emotional Analysis</h2>
            <p className="text-muted-foreground">{analysis.emotion.explanation}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={getEmotionColor(analysis.emotion.primary_emotion) as any} className="text-sm">
            {analysis.emotion.primary_emotion}
          </Badge>
          {analysis.emotion.secondary_emotion && (
            <Badge variant="outline" className="text-sm">
              {analysis.emotion.secondary_emotion}
            </Badge>
          )}
          <Badge variant={getRiskColor(analysis.context.risk_level) as any} className="text-sm">
            {analysis.context.risk_level} risk
          </Badge>
          <Badge variant="outline" className="text-sm">
            {analysis.context.topic}
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="bg-accent/30 rounded-lg p-4">
          <p className="text-sm font-medium text-accent-foreground mb-1">Situation Summary</p>
          <p className="text-foreground">{analysis.context.summary}</p>
          <p className="text-sm text-muted-foreground mt-2">
            <span className="font-medium">Goal:</span> {analysis.context.user_goal}
          </p>
        </div>
      </Card>

      {/* Message Suggestions */}
      <Card className="p-6 shadow-card bg-gradient-card border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-xl">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">Message Suggestions</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-background rounded-lg p-4 border border-border/50">
            <p className="text-sm font-medium text-primary mb-2">💙 Soft & Caring</p>
            <p className="text-foreground">{analysis.messages.soft_message}</p>
          </div>

          <div className="bg-background rounded-lg p-4 border border-border/50">
            <p className="text-sm font-medium text-secondary mb-2">💬 Honest & Direct</p>
            <p className="text-foreground">{analysis.messages.honest_message}</p>
          </div>

          <div className="bg-background rounded-lg p-4 border border-border/50">
            <p className="text-sm font-medium text-accent-foreground mb-2">🌱 Repair & Connect</p>
            <p className="text-foreground">{analysis.messages.repair_message}</p>
          </div>
        </div>
      </Card>

      {/* Action Suggestions */}
      <Card className="p-6 shadow-card bg-gradient-card border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-secondary/10 rounded-xl">
            <Lightbulb className="w-6 h-6 text-secondary" />
          </div>
          <h2 className="text-2xl font-semibold">Suggested Actions</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {analysis.actions.map((action, index) => (
            <div 
              key={index}
              className="bg-background rounded-lg p-4 border border-border/50 hover:border-primary/50 transition-colors"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {action.action_type.replace(/_/g, ' ')}
              </p>
              <p className="text-sm text-foreground">{action.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Identity Growth */}
      <Card className="p-6 shadow-card bg-gradient-hero border-0 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold">Your Growth Journey</h2>
        </div>

        <div className="space-y-3">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="font-medium flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              Identity Shift
            </p>
            <p className="text-white/90">{analysis.identity.identity_shift_message}</p>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="font-medium flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4" />
              Affirmation
            </p>
            <p className="text-white/90">{analysis.identity.self_growth_affirmation}</p>
          </div>
        </div>
      </Card>

      {/* Safety Notice */}
      {analysis.context.risk_level === "high" && (
        <Card className="p-4 bg-destructive/10 border-destructive/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive mb-1">Important Notice</p>
              <p className="text-sm text-foreground">
                This situation may require professional support. Consider reaching out to a licensed therapist or counselor who can provide personalized guidance.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
