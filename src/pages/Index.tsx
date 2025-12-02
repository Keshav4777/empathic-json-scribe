import { useState } from "react";
import { MessageInput } from "@/components/MessageInput";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Heart } from "lucide-react";
import type { AnalysisResponse } from "@/types/analysis";

const Index = () => {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12 animate-in fade-in duration-700">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-hero rounded-2xl shadow-soft">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            RelationshipAI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get compassionate guidance for healthier communication in your relationships
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          <MessageInput 
            onAnalysisComplete={setAnalysis}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          
          {analysis && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AnalysisResults analysis={analysis} />
            </div>
          )}
        </div>

        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>AI-powered relationship support • Always consult a professional for serious concerns</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
