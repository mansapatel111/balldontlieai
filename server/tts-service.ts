import * as fs from "fs";
import * as path from "path";

/**
 * Convert a single text snippet to audio using ElevenLabs API
 */
export async function generateSpeechForSnippet(
  text: string,
  voiceId: string = "21m00Tcm4TlvDq8ikWAM" // Default voice (Rachel)
): Promise<Buffer> {
  try {
    console.log(`[TTS] ========================================`);
    console.log(`[TTS] Converting to speech: "${text.substring(0, 50)}..."`);
    console.log(`[TTS] Voice ID: ${voiceId}`);

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error("ELEVENLABS_API_KEY environment variable is not set");
    }

    console.log(`[TTS] API Key exists, making request...`);
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    console.log(`[TTS] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[TTS] ❌ API Error: ${response.status} - ${errorText}`);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);
    
    console.log(`[TTS] ✅ Generated audio: ${buffer.length} bytes`);
    console.log(`[TTS] ========================================`);
    return buffer;
  } catch (error) {
    console.error("[TTS] ❌ Error generating speech:", error);
    throw error;
  }
}

export interface TTSSnippet {
  text: string;
  voiceId?: string; // Optional: override voice for specific snippet
  startTime?: number; // When this snippet should play in seconds
}

/**
 * Convert multiple snippets to speech and combine them
 * Returns path to combined MP3 file
 */
export async function generateCombinedSpeech(
  snippets: TTSSnippet[],
  voiceId: string = "21m00Tcm4TlvDq8ikWAM",
  outputFileName?: string
): Promise<{ audioPath: string; fileName: string }> {
  try {
    console.log(`\n[TTS] 🎤 START COMBINED SPEECH GENERATION`);
    console.log(`[TTS] Number of snippets: ${snippets.length}`);
    console.log(`[TTS] Voice ID: ${voiceId}`);

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), "public", "sounds", "commentary");
    console.log(`[TTS] Output directory: ${tempDir}`);
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log(`[TTS] ✅ Created directory`);
    } else {
      console.log(`[TTS] ✅ Directory already exists`);
    }

    // Generate audio for each snippet
    const audioBuffers: Buffer[] = [];
    for (let i = 0; i < snippets.length; i++) {
      const snippet = snippets[i];
      console.log(`[TTS] \n[Snippet ${i + 1}/${snippets.length}] Processing...`);
      console.log(`[TTS] Text: "${snippet.text.substring(0, 60)}..."`);
      
      const audio = await generateSpeechForSnippet(snippet.text, snippet.voiceId || voiceId);
      audioBuffers.push(audio);
      console.log(`[TTS] ✅ Snippet ${i + 1} completed`);

      // Small delay between API calls to avoid rate limiting
      if (i < snippets.length - 1) {
        console.log(`[TTS] Waiting 200ms before next snippet...`);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    // Combine all audio buffers
    console.log(`\n[TTS] Combining ${audioBuffers.length} audio buffers...`);
    const combinedAudio = Buffer.concat(audioBuffers);
    console.log(`[TTS] ✅ Combined audio size: ${combinedAudio.length} bytes`);

    // Save to file
    const fileName = outputFileName || `commentary-${Date.now()}.mp3`;
    const audioPath = path.join(tempDir, fileName);
    
    console.log(`[TTS] Saving to: ${audioPath}`);
    fs.writeFileSync(audioPath, combinedAudio);
    console.log(`[TTS] ✅ File saved successfully`);
    
    // Verify file was saved
    const fileSize = fs.statSync(audioPath).size;
    console.log(`[TTS] ✅ File verification - size: ${fileSize} bytes`);
    console.log(`[TTS] 🎤 END COMBINED SPEECH GENERATION\n`);

    return {
      audioPath,
      fileName,
    };
  } catch (error) {
    console.error("[TTS] ❌ Error generating combined speech:", error);
    throw error;
  }
}

/**
 * Get available voices from ElevenLabs
 */
export async function getAvailableVoices() {
  try {
    console.log("[TTS] Fetching available voices");
    const client = getElevenLabsClient();
    const voices = await client.voices.getAll();
    console.log(`[TTS] Found ${voices.voices.length} voices`);
    return voices.voices;
  } catch (error) {
    console.error("[TTS] Error fetching voices:", error);
    throw error;
  }
}
