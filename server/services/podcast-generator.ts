import { AIModel } from '@shared/schema';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export interface PodcastScript {
  script: string;
  summary: string;
  strengths: string;
  weaknesses: string;
  insights: string;
  quotations: string[];
}

export class PodcastGeneratorService {
  
  async generatePodcastScript(text: string, model: AIModel, customInstructions?: string): Promise<string> {
    const prompt = customInstructions 
      ? this.createCustomPodcastPrompt(text, customInstructions)
      : this.createPodcastPrompt(text);
    
    try {
      let response: string;
      
      switch (model) {
        case 'openai':
          response = await this.generateWithOpenAI(prompt);
          break;
        case 'anthropic':
          response = await this.generateWithAnthropic(prompt);
          break;
        case 'perplexity':
          response = await this.generateWithPerplexity(prompt);
          break;
        case 'deepseek':
          response = await this.generateWithDeepSeek(prompt);
          break;
        default:
          // Fallback to OpenAI
          response = await this.generateWithOpenAI(prompt);
      }
      
      return this.formatPodcastScript(response);
      
    } catch (error) {
      console.error('Error generating podcast script:', error);
      // Fallback to OpenAI if primary model fails
      if (model !== 'openai') {
        try {
          const response = await this.generateWithOpenAI(prompt);
          return this.formatPodcastScript(response);
        } catch (fallbackError) {
          console.error('Fallback OpenAI also failed:', fallbackError);
          throw new Error('Failed to generate podcast script with all available models');
        }
      }
      throw error;
    }
  }

  private async generateWithOpenAI(prompt: string): Promise<string> {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    });

    return completion.choices[0]?.message?.content || '';
  }

  private async generateWithAnthropic(prompt: string): Promise<string> {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "",
    });

    const completion = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }]
    });

    return completion.content[0]?.type === 'text' ? completion.content[0].text : '';
  }

  private async generateWithPerplexity(prompt: string): Promise<string> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async generateWithDeepSeek(prompt: string): Promise<string> {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private createPodcastPrompt(text: string): string {
    return `You are creating a podcast script about a specific passage from "A Room With A View" by E. M. Forster. Your task is to create an engaging, informative podcast episode that follows this exact structure:

SELECTED PASSAGE:
"${text}"

Create a podcast script that follows this EXACT format:

**INTRODUCTION & SUMMARY**
[Provide a clear, engaging summary of the selected passage in 2-3 sentences]

**ANALYSIS OF STRENGTHS**
[Discuss what makes this passage valuable, insightful, or well-written. What does Forster do particularly well here?]

**ANALYSIS OF WEAKNESSES** 
[Identify any limitations, dated social attitudes, or areas where modern readers might find the perspectives outdated. Be fair but critical.]

**READER INSIGHTS**
[Provide practical insights for readers - what can they learn from this passage? How does it apply to understanding literature, social conventions, and human relationships?]

**FIVE KEY QUOTATIONS**
[Extract exactly 5 powerful, representative quotes from the selected passage. Present each as: "Quote 1: [exact quote]", "Quote 2: [exact quote]", etc.]

IMPORTANT GUIDELINES:
- Write in a conversational podcast style, as if speaking directly to listeners
- Keep the tone engaging but respectful to Forster's literary achievements
- Focus specifically on the selected passage, not general information about Forster
- Make the content accessible to general audiences interested in literature
- Each section should be substantial but concise (2-4 sentences each)
- The quotations MUST be exact excerpts from the provided passage
- Do not use any markdown formatting - write in plain text only

Generate a complete podcast script now:`;
  }

  private createCustomPodcastPrompt(text: string, customInstructions: string): string {
    return `You are creating a podcast script about a specific passage from "A Room With A View" by E. M. Forster based on custom user instructions.

SELECTED PASSAGE:
"${text}"

USER'S CUSTOM INSTRUCTIONS:
${customInstructions}

Create a podcast script following the user's instructions. Write in a conversational podcast style, as if speaking directly to listeners. Keep the tone engaging but respectful. Focus specifically on the selected passage.

IMPORTANT GUIDELINES:
- Write in conversational podcast style
- Make content accessible to general audiences interested in literature  
- Focus specifically on the selected passage, not general information about Forster
- Do not use any markdown formatting - write in plain text only
- Follow the user's specific instructions for content structure and focus

Generate the podcast script now:`;
  }

  private formatPodcastScript(rawScript: string): string {
    // Clean up any markdown formatting and ensure proper structure
    return rawScript
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic markdown
      .replace(/#{1,6}\s+/g, '') // Remove header markdown
      .trim();
  }
}

export const podcastGeneratorService = new PodcastGeneratorService();