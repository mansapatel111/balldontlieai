import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
<<<<<<< HEAD
import { YoutubeTranscript } from "youtube-transcript";
import OpenAI from "openai";
import { PERSONALITIES, MODEL } from "./personalities";
import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";
import path from "path";

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
=======
>>>>>>> 9b298a6 (Restored to '3a63cc8dd4bbf89669795d3c5ecccc58eb3b1d23')

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
<<<<<<< HEAD
  // Initialize API clients here (after dotenv has loaded)
  console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
  console.log('ELEVENLABS_API_KEY exists:', !!process.env.ELEVENLABS_API_KEY);
  
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get available ElevenLabs voices
  app.get("/api/voices", async (req, res) => {
    try {
      const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Format voices for frontend
      const voices = data.voices.map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
        category: voice.category,
        labels: voice.labels,
        description: voice.description || `${voice.name} voice`,
      }));

      res.json({ voices });
    } catch (error: any) {
      console.error("Error fetching voices:", error);
      res.status(500).json({ error: error.message || "Failed to fetch voices" });
    }
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
      const formatted: TranscriptSnippet[] = transcript.map((item: any) => ({
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
      }, {
        headers: {
          "HTTP-Referer": "http://localhost:3000",
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
      const formatted: TranscriptSnippet[] = transcript.map((item: any) => ({
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
      }, {
        headers: {
          "HTTP-Referer": "http://localhost:3000",
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

  // Generate audio from commentary
  app.post("/api/generate-audio", async (req, res) => {
    try {
      const { commentary, voiceId } = req.body;

      if (!commentary || !Array.isArray(commentary)) {
        return res.status(400).json({ error: "commentary array is required" });
      }

      const selectedVoiceId = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default to Rachel voice
      const fullText = commentary.map((c: RewrittenSnippet) => c.line).join(" ");

      const audioDir = path.join(process.cwd(), "server", "public", "audio");
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }

      const filename = `commentary_${Date.now()}.mp3`;
      const filepath = path.join(audioDir, filename);

      const audio = await elevenlabs.textToSpeech.convert(selectedVoiceId, {
        text: fullText,
        model_id: "eleven_turbo_v2",
      });

      // Convert async iterable to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // Write to file
      fs.writeFileSync(filepath, buffer);

      res.json({ 
        audioUrl: `/audio/${filename}`,
      });
    } catch (error: any) {
      console.error("Error generating audio:", error);
      res.status(500).json({ error: error.message || "Failed to generate audio" });
    }
  });

  // Full pipeline: transcript + commentary + audio
  app.post("/api/process-with-audio", async (req, res) => {
    try {
      const { videoId, personality, voiceId } = req.body;

      console.log("Processing video:", { videoId, personality, voiceId });

      if (!videoId || !personality) {
        return res.status(400).json({ 
          error: "videoId and personality are required" 
        });
      }

      // Step 1: Fetch transcript
      console.log("Fetching transcript for:", videoId);
      let transcript;
      try {
        transcript = await YoutubeTranscript.fetchTranscript(videoId);
        
        console.log("Transcript fetched:", transcript?.length || 0);
        
        if (!transcript || transcript.length === 0) {
          return res.status(400).json({ 
            error: "No transcript available for this video. Please ensure the video has captions/subtitles enabled." 
          });
        }
      } catch (transcriptError: any) {
        console.error("Transcript fetch error:", transcriptError);
        return res.status(400).json({ 
          error: `Failed to fetch transcript: ${transcriptError.message}. Make sure the video has captions enabled.` 
        });
      }
      
      const formatted: TranscriptSnippet[] = transcript.map((item: any) => ({
        text: item.text,
        start: item.offset / 1000,
        duration: item.duration / 1000,
      }));

      console.log("Formatted transcript items:", formatted.length);

      // Step 2: Generate commentary
      const totalTime = formatted.reduce((sum, snippet) => sum + snippet.duration, 0);
      console.log("Total video time:", totalTime.toFixed(1), "seconds");
      
      const basePrompt = PERSONALITIES[personality].replace("{total_time}", totalTime.toFixed(1));

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
      }, {
        headers: {
          "HTTP-Referer": "http://localhost:3000",
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

      // Step 3: Generate audio
      const selectedVoiceId = voiceId || "21m00Tcm4TlvDq8ikWAM";
      const fullText = rewrittenTranscript.map((c) => c.line).join(" ");

      const audioDir = path.join(process.cwd(), "server", "public", "audio");
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }

      const filename = `commentary_${Date.now()}.mp3`;
      const filepath = path.join(audioDir, filename);

      const audio = await elevenlabs.textToSpeech.convert(selectedVoiceId, {
        text: fullText,
        model_id: "eleven_turbo_v2",
      });

      // Convert async iterable to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // Write to file
      fs.writeFileSync(filepath, buffer);

      res.json({ 
        originalTranscript: formatted,
        commentary: rewrittenTranscript,
        audioUrl: `/audio/${filename}`,
        totalTime,
        personality,
      });
    } catch (error: any) {
      console.error("Error processing with audio:", error);
      res.status(500).json({ error: error.message || "Failed to process video with audio" });
    }
  });
=======
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)
>>>>>>> 9b298a6 (Restored to '3a63cc8dd4bbf89669795d3c5ecccc58eb3b1d23')

  return httpServer;
}
