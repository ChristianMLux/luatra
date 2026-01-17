import { safeParseJSON } from '../utils';

interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

export class AIService {
  // No constructor - env vars are checked at method call time (server-side only)

  async generateJSON<T>(prompt: string, schema?: string): Promise<T> {
    // Read env vars at call time (not module load time) for server-side execution
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.LLM_MODEL || 'google/gemini-3-flash-preview';

    if (!apiKey) {
      throw new Error('OpenRouter API Key is not configured. Please set OPENROUTER_API_KEY in .env.local');
    }

    try {
      const fullPrompt = `
        ${prompt}
        
        ${schema ? `Output STRICT JSON matching this schema:\n${schema}` : 'Output STRICT JSON.'}
        DO NOT use markdown code blocks. Just the raw JSON string.
      `;

      const messages: OpenRouterMessage[] = [
        { role: 'user', content: fullPrompt }
      ];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
          'X-Title': 'Luatra Joatra',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API Error:', response.status, errorText);
        throw new Error(`OpenRouter API Error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const text = data.choices[0]?.message?.content;
      if (!text) {
        throw new Error('No content in OpenRouter response');
      }

      return safeParseJSON<T>(text);
    } catch (error) {
      console.error('AI Generation Failed:', error);
      throw error;
    }
  }

  async generateText(prompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.LLM_MODEL || 'google/gemini-3-flash-preview';

    if (!apiKey) {
      throw new Error('OpenRouter API Key is not configured. Please set OPENROUTER_API_KEY in .env.local');
    }

    try {
      const messages: OpenRouterMessage[] = [
        { role: 'user', content: prompt }
      ];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
          'X-Title': 'Luatra Joatra',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API Error:', response.status, errorText);
        throw new Error(`OpenRouter API Error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const text = data.choices[0]?.message?.content;
      if (!text) {
        throw new Error('No content in OpenRouter response');
      }

      return text;
    } catch (error) {
      console.error('AI Generation Failed (Text):', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
