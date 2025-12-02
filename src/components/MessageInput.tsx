import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { AnalysisResponse } from "@/types/analysis";

interface MessageInputProps {
  onAnalysisComplete: (analysis: AnalysisResponse) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const MessageInput = ({ onAnalysisComplete, isLoading, setIsLoading }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [relationshipRole, setRelationshipRole] = useState("");
  const [preferredTone, setPreferredTone] = useState("");

  const handleAnalyze = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message to analyze");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-message", {
        body: {
          userText: message.trim(),
          userMeta: {
            relationship_role: relationshipRole || undefined,
            preferred_tone: preferredTone || undefined,
          },
        },
      });

      if (error) {
        console.error("Function invocation error:", error);
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from analysis");
      }

      // Check for safety blocks
      if (data.safety?.blocked) {
        toast.error(data.safety.safe_reason || "This message contains concerning content");
        return;
      }

      if (data.safety?.escalation) {
        toast.error("Please seek immediate help from a crisis resource", {
          description: data.safety.safe_alternative,
          duration: 10000,
        });
        return;
      }

      onAnalysisComplete(data);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error analyzing message:", error);
      toast.error("Failed to analyze message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 shadow-card bg-gradient-card border-border/50">
      <div className="space-y-6">
        <div>
          <Label htmlFor="message" className="text-base font-medium mb-2 block">
            What's on your mind?
          </Label>
          <Textarea
            id="message"
            placeholder="Share what you're feeling or thinking about your relationship..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[160px] resize-none text-base"
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="role" className="text-sm mb-2 block">
              Your role (optional)
            </Label>
            <Input
              id="role"
              placeholder="e.g., partner, spouse, friend"
              value={relationshipRole}
              onChange={(e) => setRelationshipRole(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="tone" className="text-sm mb-2 block">
              Preferred tone (optional)
            </Label>
            <Input
              id="tone"
              placeholder="e.g., gentle, direct, warm"
              value={preferredTone}
              onChange={(e) => setPreferredTone(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={isLoading || !message.trim()}
          className="w-full bg-gradient-hero hover:opacity-90 transition-opacity text-lg py-6"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze Message
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
