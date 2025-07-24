import { Readable } from 'stream';

interface AzureSpeechConfig {
  endpoint: string;
  key: string;
  region: string;
}

export class AzureSpeechService {
  private config: AzureSpeechConfig | null = null;

  constructor() {
    const key = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION;
    
    if (key && region) {
      // Build endpoint from region
      const endpoint = `https://${region}.tts.speech.microsoft.com`;
      console.log(`Azure Speech Service initialized with region: ${region}, endpoint: ${endpoint}`);
      this.config = { endpoint, key, region };
    } else {
      console.log('Azure Speech Service not configured - podcast audio generation will be disabled');
      this.config = null;
    }
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  async synthesizeSpeech(text: string, voice: string = 'en-US-JennyNeural'): Promise<Buffer> {
    if (!this.config) {
      throw new Error('Azure Speech Service not configured. Please set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION environment variables.');
    }

    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="${voice}">
          <prosody rate="1.0" pitch="medium">
            ${this.escapeXml(text)}
          </prosody>
        </voice>
      </speak>
    `;

    const url = `${this.config.endpoint}/cognitiveservices/v1`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'Dream-Psychology-Podcast'
      },
      body: ssml
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Azure Speech API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return Buffer.from(audioBuffer);
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  async generatePodcastAudio(script: string): Promise<Buffer> {
    if (!this.config) {
      throw new Error('Azure Speech Service not configured. Please set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION environment variables.');
    }

    // Split long text into manageable chunks for better speech synthesis
    const chunks = this.splitTextIntoChunks(script, 5000); // Azure has limits
    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      try {
        const audio = await this.synthesizeSpeech(chunk, 'en-US-JennyNeural');
        audioBuffers.push(audio);
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Error synthesizing chunk:', error);
        throw error;
      }
    }

    // Concatenate audio buffers (simple concatenation for MP3)
    return Buffer.concat(audioBuffers);
  }

  private splitTextIntoChunks(text: string, maxLength: number): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (currentChunk.length + trimmedSentence.length + 1 > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim() + '.');
          currentChunk = trimmedSentence;
        } else {
          // Handle very long sentences by splitting further
          chunks.push(trimmedSentence.substring(0, maxLength));
          currentChunk = trimmedSentence.substring(maxLength);
        }
      } else {
        currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim() + '.');
    }
    
    return chunks;
  }
}

export const azureSpeechService = new AzureSpeechService();