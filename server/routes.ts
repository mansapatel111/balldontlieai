import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { YoutubeTranscript } from "youtube-transcript";
import OpenAI from "openai";
import { PERSONALITIES, MODEL } from "./personalities";
import dotenv from "dotenv";

dotenv.config();

// OpenRouter client
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

interface TranscriptSnippet {
  text: string;
  start: number;
  duration: number;
}

interface RewrittenSnippet {
  start: number;
  duration: number;
  line: string;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Fetch YouTube transcript
  app.post("/api/transcript", async (req, res) => {
    try {
      const { videoId } = req.body;

      if (!videoId) {
        return res.status(400).json({ error: "videoId is required" });
      }

      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      
      // Convert to our format
      const formatted: TranscriptSnippet[] = transcript.map((item) => ({
        text: item.text,
        start: item.offset / 1000, // Convert ms to seconds
        duration: item.duration / 1000,
      }));

      res.json({ transcript: formatted });
    } catch (error: any) {
      console.error("Error fetching transcript:", error);
      res.status(500).json({ error: error.message || "Failed to fetch transcript" });
    }
  });

  // Generate commentary
  app.post("/api/generate-commentary", async (req, res) => {
    try {
      const { transcript, personality } = req.body;

      if (!transcript || !personality) {
        return res.status(400).json({ 
          error: "transcript and personality are required" 
        });
      }

      if (!PERSONALITIES[personality]) {
        return res.status(400).json({ 
          error: `Invalid personality. Must be one of: ${Object.keys(PERSONALITIES).join(", ")}` 
        });
      }

      // Calculate total time
      const totalTime = transcript.reduce(
        (sum: number, snippet: TranscriptSnippet) => sum + snippet.duration,
        0
      );

      // Format the personality prompt with total time
      const basePrompt = PERSONALITIES[personality].replace(
        "{total_time}",
        totalTime.toFixed(1)
      );

      const userPrompt = `
${basePrompt}

TASK:
Rewrite EACH snippet's text into the chosen personality, while keeping the same event.
Each rewritten line MUST be speakable within that snippet's duration.

OUTPUT FORMAT (STRICT JSON ONLY):
Return a JSON array. Each element must be:
{
  "start": <number>,
  "duration": <number>,
  "line": <string>
}

TRANSCRIPT SNIPPETS:
${JSON.stringify(transcript, null, 2)}
      `.trim();

      const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "Return valid JSON only. Output must be a JSON array with keys start, duration, line.",
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        extra_headers: {
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "Ball Don't Lie AI",
        },
      });

      const content = response.choices[0].message.content?.trim() || "";
      
      // Parse the JSON response
      let rewrittenTranscript: RewrittenSnippet[];
      try {
        // Try to extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || content.match(/```\n([\s\S]*)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;
        rewrittenTranscript = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Failed to parse AI response:", content);
        return res.status(500).json({ error: "Failed to parse AI response", rawResponse: content });
      }

      res.json({ 
        commentary: rewrittenTranscript,
        totalTime,
      });
    } catch (error: any) {
      console.error("Error generating commentary:", error);
      res.status(500).json({ error: error.message || "Failed to generate commentary" });
    }
  });

  // Combined endpoint: get transcript and generate commentary in one call
  app.post("/api/process-video", async (req, res) => {
    try {
      const { videoId, personality } = req.body;

      if (!videoId || !personality) {
        return res.status(400).json({ 
          error: "videoId and personality are required" 
        });
      }

      // Fetch transcript
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      const formatted: TranscriptSnippet[] = transcript.map((item) => ({
        text: item.text,
        start: item.offset / 1000,
        duration: item.duration / 1000,
      }));

      // Calculate total time
      const totalTime = formatted.reduce(
        (sum, snippet) => sum + snippet.duration,
        0
      );

      // Format the personality prompt
      const basePrompt = PERSONALITIES[personality].replace(
        "{total_time}",
        totalTime.toFixed(1)
      );

      const userPrompt = `
${basePrompt}

TASK:
Rewrite EACH snippet's text into the chosen personality, while keeping the same event.
Each rewritten line MUST be speakable within that snippet's duration.

OUTPUT FORMAT (STRICT JSON ONLY):
Return a JSON array. Each element must be:
{
  "start": <number>,
  "duration": <number>,
  "line": <string>
}

TRANSCRIPT SNIPPETS:
${JSON.stringify(formatted, null, 2)}
      `.trim();

      const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "Return valid JSON only. Output must be a JSON array with keys start, duration, line.",
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        extra_headers: {
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "Ball Don't Lie AI",
        },
      });

      const content = response.choices[0].message.content?.trim() || "";
      
      let rewrittenTranscript: RewrittenSnippet[];
      try {
        const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || content.match(/```\n([\s\S]*)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;
        rewrittenTranscript = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Failed to parse AI response:", content);
        return res.status(500).json({ error: "Failed to parse AI response", rawResponse: content });
      }

      res.json({ 
        originalTranscript: formatted,
        commentary: rewrittenTranscript,
        totalTime,
        personality,
      });
    } catch (error: any) {
      console.error("Error processing video:", error);
      res.status(500).json({ error: error.message || "Failed to process video" });
    }
  });

  return httpServer;
}
