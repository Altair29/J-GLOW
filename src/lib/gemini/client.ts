const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

type GeminiMessage = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

type GeminiRequest = {
  contents: GeminiMessage[];
  systemInstruction?: { parts: { text: string }[] };
  generationConfig?: {
    temperature?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
};

type GeminiResponse = {
  candidates: {
    content: { parts: { text: string }[] };
    finishReason: string;
  }[];
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
};

export async function callGemini(
  prompt: string,
  systemPrompt?: string,
  model = 'gemini-2.0-flash'
): Promise<{ text: string; promptTokens: number }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const body: GeminiRequest = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  };

  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  const response = await fetch(
    `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorText}`);
  }

  const data: GeminiResponse = await response.json();
  const text = data.candidates[0]?.content?.parts?.[0]?.text ?? '';
  const promptTokens = data.usageMetadata?.promptTokenCount ?? 0;

  return { text, promptTokens };
}
