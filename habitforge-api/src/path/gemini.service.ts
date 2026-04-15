import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GeneratedTask {
  dayNumber: number;
  weekNumber: number;
  title: string;
  description: string;
  taskType: 'LEARN' | 'PRACTICE' | 'PROJECT' | 'REVIEW' | 'QUIZ';
  estimatedMinutes: number;
  resources: string[];
  xpReward: number;
}

export interface GeneratedCurriculum {
  title: string;
  overview: string;
  weeklyThemes: string[];
  tasks: GeneratedTask[];
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);

  constructor(private readonly configService: ConfigService) {}

  async generateCurriculum(goal: string, durationDays: number, dailyMinutes: number, currentLevel: string = 'complete beginner', additionalContext: string = 'none'): Promise<GeneratedCurriculum> {
    const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are an expert curriculum designer and learning coach. 
You create structured, practical, day-by-day learning plans.
You MUST respond ONLY with valid JSON, no markdown, no explanation outside the JSON.`;

    const userPrompt = `Create a ${durationDays}-day learning curriculum for this goal:
GOAL: ${goal}
DAILY TIME AVAILABLE: ${dailyMinutes} minutes
CURRENT LEVEL: ${currentLevel}
ADDITIONAL CONTEXT: ${additionalContext}

Return a JSON object with this EXACT structure:
{
  "title": "short curriculum title",
  "overview": "2-3 sentence overview of the learning journey",
  "weeklyThemes": ["Week 1: Theme", "Week 2: Theme", ...],
  "tasks": [
    {
      "dayNumber": 1,
      "weekNumber": 1,
      "title": "Task title (action-oriented, max 60 chars)",
      "description": "Detailed 3-5 sentence description of exactly what to do today",
      "taskType": "LEARN",
      "estimatedMinutes": ${dailyMinutes},
      "resources": ["Resource 1 name or URL", "Resource 2"],
      "xpReward": 100
    }
  ]
}
IMPORTANT: 
- Every single day from 1 to ${durationDays} must have exactly ONE task entry
- Tasks must build progressively in difficulty
- Week 1-2: fundamentals and setup
- Middle weeks: core concepts and practice
- Final weeks: projects, real-world application, review
- taskType should vary: ~40% LEARN, ~30% PRACTICE, ~15% PROJECT, ~10% REVIEW, ~5% QUIZ
- xpReward: LEARN=80, PRACTICE=100, PROJECT=150, REVIEW=60, QUIZ=120
- descriptions must be specific and actionable, not vague`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt + '\n\n' + userPrompt }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
      }
    };

    let attempts = 0;
    while (attempts < 2) {
        attempts++;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`Gemini API Error: ${response.status} - ${errorText}`);
                throw new Error('API returned an error');
            }

            const data = await response.json();
            
            // Log token usage if available in the response.
            if (data.usageMetadata) {
                this.logger.log(`Gemini Tokens Used: ${JSON.stringify(data.usageMetadata)}`);
            }

            let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawText) throw new Error('No content in response');

            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(rawText) as GeneratedCurriculum;
            
            if (!parsed.tasks || parsed.tasks.length !== durationDays) {
                this.logger.warn(`Expected ${durationDays} tasks, got ${parsed.tasks?.length}. Retrying...`);
                throw new Error('Invalid task count in JSON');
            }
            
            return parsed;

        } catch (error) {
            this.logger.error(`Gemini Attempt ${attempts} Failed:`, error);
            if (attempts >= 2) {
                throw new ServiceUnavailableException('The AI Learning service is currently unavailable or failed to construct the curriculum. Please try again later.');
            }
        }
    }
    throw new ServiceUnavailableException('The AI Learning service is currently unavailable.');
  }
}
