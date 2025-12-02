import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userText, chatSnippets, userMeta } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!userText || typeof userText !== 'string' || userText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "userText is required and must be a non-empty string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing message:", { userText, hasSnippets: !!chatSnippets, hasMeta: !!userMeta });

    const systemPrompt = `You are an expert AI relationship and mental health assistant. Analyze the user's message and provide a comprehensive JSON response following this exact schema:

{
  "emotion": {
    "primary_emotion": "(anger|sadness|hurt|fear|stress|jealousy|guilt|love|disappointment|neutral)",
    "secondary_emotion": "short phrase or empty string",
    "intensity": 0.0-1.0,
    "explanation": "one-sentence explanation"
  },
  "context": {
    "situation": "short label",
    "cause": "brief trigger",
    "user_goal": "(venting|reconcile|seek_advice|apology|breakup|unclear)",
    "risk_level": "(low|medium|high)",
    "topic": "(trust|communication|expectations|emotional_need|insecurity|other)",
    "summary": "one-sentence summary"
  },
  "safety": {
    "blocked": false,
    "safe_reason": "if blocked, explain briefly",
    "safe_alternative": "if blocked, provide safe alternative",
    "escalation": false
  },
  "messages": {
    "soft_message": "warm 1-2 sentence option",
    "honest_message": "calm 1-2 sentence using I-statements",
    "repair_message": "1-2 sentence repair/bond-building option"
  },
  "actions": [
    {
      "action_type": "small_caring_action",
      "description": "one-line actionable suggestion"
    },
    {
      "action_type": "romantic_idea",
      "description": "one-line low-cost romantic idea"
    },
    {
      "action_type": "healing_activity",
      "description": "one-line activity to repair connection or self-soothe"
    }
  ],
  "identity": {
    "identity_shift_message": "one-line identity-focused nudge",
    "self_growth_affirmation": "one short affirmation"
  }
}

CRITICAL SAFETY RULES:
- If harmful intent detected (manipulation, coercion, violence, self-harm), set safety.blocked=true
- For high risk or self-harm mentions, set safety.escalation=true and provide crisis resources in safe_alternative
- All messages must use first-person "I" statements
- Keep all messages ≤2 sentences
- Be non-manipulative and supportive
- Tailor tone to userMeta if provided`;

    const userPrompt = `USER MESSAGE: ${userText}
${chatSnippets ? `\nCHAT CONTEXT: ${chatSnippets}` : ''}
${userMeta ? `\nUSER INFO: ${JSON.stringify(userMeta)}` : ''}

Analyze this message and respond with ONLY valid JSON matching the exact schema.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage credits depleted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received, parsing JSON");
    
    // Extract JSON from markdown code blocks if present
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.slice(7);
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.slice(3);
    }
    if (jsonContent.endsWith('```')) {
      jsonContent = jsonContent.slice(0, -3);
    }
    jsonContent = jsonContent.trim();

    const analysis = JSON.parse(jsonContent);

    console.log("Analysis complete:", {
      emotion: analysis.emotion?.primary_emotion,
      riskLevel: analysis.context?.risk_level,
      blocked: analysis.safety?.blocked
    });

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-message:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
