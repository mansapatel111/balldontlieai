import type { Express } from "express";
import { OpenAI } from "openai";
import {
  PERSONALITIES,
  type CommentaryRequest,
  type CommentaryResponse,
  type CommentarySnippet,
} from "../shared/commentary-types";
import { generateCombinedSpeech } from "./tts-service";

// Initialize OpenAI client lazily to ensure env vars are loaded
let client: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }
    client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "Ball Don't Lie - AI Commentary",
      },
    });
  }
  return client;
}

export function registerCommentaryRoutes(app: Express) {
  app.post("/api/commentary", async (req, res) => {
    try {
      const { videoId, personality, transcript } = req.body as CommentaryRequest & { transcript: string };

      if (!videoId || !personality) {
        res.status(400).json({
          success: false,
          error: "videoId and personality are required",
        });
        return;
      }

      if (!PERSONALITIES[personality]) {
        res.status(400).json({
          success: false,
          error: `Unknown personality: ${personality}`,
        });
        return;
      }

      if (!transcript) {
        res.status(400).json({
          success: false,
          error: "transcript is required",
        });
        return;
      }

      console.log(`[COMMENTARY] Generating commentary for video: ${videoId}, personality: ${personality}`);

      // Build the prompt
      const basePrompt = PERSONALITIES[personality];

      const userPrompt = `
${basePrompt}

TASK:
Rewrite the following transcript into the chosen personality style.
Break it into 5-8 short lines/phrases that could be spoken as commentary over the video.

OUTPUT FORMAT (STRICT JSON ONLY):
Return a JSON array of strings. Each string should be a piece of commentary in the personality style.
Example:
["Line 1 of commentary", "Line 2 of commentary", "Line 3 of commentary"]

TRANSCRIPT:
${transcript}
`;

      // Call Gemini via OpenRouter
      console.log("[COMMENTARY] Calling Gemini API...");
      console.log("[COMMENTARY] API Key exists:", !!process.env.OPENROUTER_API_KEY);
      
      const response = await getOpenAIClient().chat.completions.create({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content:
              "Return valid JSON only. Output must be a JSON array of strings (commentary lines).",
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      });

      console.log("[COMMENTARY] API Response received");
      console.log("[COMMENTARY] Choices length:", response.choices.length);
      console.log("[COMMENTARY] First choice:", response.choices[0]);

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response from API");
      }

      console.log("[COMMENTARY] Raw API response:", content);

      // Parse the JSON response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Could not parse JSON from response: " + content);
      }

      const commentaryLines: string[] = JSON.parse(jsonMatch[0]);
      console.log("[COMMENTARY] Parsed commentary lines:", commentaryLines);

      // Convert to snippets format (distribute evenly across estimated video duration)
      const estimatedDuration = 60; // seconds - adjust based on your videos
      const snippets: CommentarySnippet[] = commentaryLines.map((line, index) => ({
        start: (index / commentaryLines.length) * estimatedDuration,
        duration: (estimatedDuration / commentaryLines.length),
        line: line,
      }));

      console.log("[COMMENTARY] Generated snippets:", snippets);

      // Generate speech for each snippet using ElevenLabs
      console.log("[COMMENTARY] ▶️  Starting TTS generation...");
      const ttsSnippets = commentaryLines.map((line) => ({ text: line }));
      console.log("[COMMENTARY] TTS Snippets to convert:", ttsSnippets.length);
      
      const { fileName, audioPath } = await generateCombinedSpeech(ttsSnippets);
      
      // Create URL to access the audio file
      const audioUrl = `/sounds/commentary/${fileName}`;
      console.log("[COMMENTARY] ✅ Audio generation complete!");
      console.log("[COMMENTARY] File saved at:", audioPath);
      console.log("[COMMENTARY] Audio URL:", audioUrl);

      res.json({
        success: true,
        snippets,
        audioUrl,
      } as CommentaryResponse);
    } catch (error) {
      console.error("[COMMENTARY] Error:", error);
      console.error("[COMMENTARY] Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.constructor.name : typeof error,
        fullError: error
      });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate commentary",
      });
    }
  });
}
