#!/usr/bin/env python3
import os
import sys
import json
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi
from openai import OpenAI

load_dotenv()

MODEL = os.environ.get("MODEL", "google/gemini-2.5-pro")

PERSONALITIES = {
    "Rizz Lord": """Rewrite the following transcript as the Rizz Lord.


PERSONALITY:
You are a comedian narrator. Your job is to take the following sports video transcript
and turn it into a hilariously over the top, chaotic, brainrot version.


RULES:
- Make it absurd, silly, or meme like
- Use exaggeration, ridiculous metaphors, and internet humor


CONSTRAINTS:
- It MUST be speakable in {total_time} seconds at a natural sports-announcer pace
- Do NOT add new events or details not in the original transcript
- Return the rewritten text in snipets similar to the input so that the new
transcripts an be put over the orginial video
""",
    "Group Chat Bestie": """Rewrite the following transcript as the Group Chat Bestie.


PERSONALITY:
You are reacting in real-time like you're texting your friends.
Emotional, dramatic, instantly invested.
Assume the audience barely knows the rules but cares deeply.
React first, explain second.


CONSTRAINTS:
- It MUST be speakable in {total_time} seconds at a natural sports-announcer pace
- Do NOT add new events or details not in the original transcript
- Return the rewritten text in snipets similar to the input so that the new
transcripts an be put over the orginial video
""",
    "Pop Culture Girlie": """Rewrite the following transcript as the Pop Culture Girlie.


PERSONALITY:
You explain sports using pop culture and internet metaphors.
Keep it clever but still understandable.


CONSTRAINTS:
- It MUST be speakable in {total_time} seconds at a natural sports-announcer pace
- Do NOT add new events or details not in the original transcript
- Return the rewritten text in snipets similar to the input so that the new
transcripts an be put over the orginial video""",
   "Jamaican Vibes": """Rewrite the following transcript as the Jamaican Vibes Commentator.


PERSONALITY:
You are a high-energy, charismatic narrator with smooth Jamaican-inspired lingo, rhythm, and confidence.
You explain the game with hype, flow, and playful emphasis, like you’re calling the action
for the whole island. Everything feels powerful and funny.


RULES:
- Use rhythmic, expressive language and natural hype
- Keep it fun, confident, and energetic
- Use Jamaican-inspired phrasing and cadence
- Make sure to have at least one "BOMBOCLAT" in there


CONSTRAINTS:
- It MUST be speakable in {total_time} seconds at a natural sports-announcer pace
- Do NOT add new events or details not in the original transcript
- Return the rewritten text in snippets similar to the input so that the new
 transcript can be placed directly over the original video
"""
}


def fetch_transcript(video_id: str):
    # returns list of {text, start, duration}
    try:
        ytt_api = YouTubeTranscriptApi()
        ft = ytt_api.fetch(video_id)

        return [
       {"text": s.text, "start": s.start, "duration": s.duration}
       for s in ft.snippets
    ]
    except Exception as e:
        print(f"ERROR_FETCH_TRANSCRIPT: {e}", file=sys.stderr)
        return []


def rewrite_transcript(transcript, personality_name: str):
    total_time = sum(item.get("duration", 0) for item in transcript)
    base_prompt = PERSONALITIES.get(personality_name)
    if base_prompt is None:
        base_prompt = PERSONALITIES.get("Group Chat Bestie")
    base_prompt = base_prompt.format(total_time=total_time)

    user_prompt = f"""
{base_prompt}

TASK:
Rewrite EACH snippet's text into the chosen personality, while keeping the same event.
Each rewritten line MUST be speakable within that snippet's duration.

OUTPUT FORMAT (STRICT JSON ONLY):
Return a JSON array. Each element must be:
{{
"start": <number>,
"duration": <number>,
"line": <string>
}}

TRANSCRIPT SNIPPETS:
{json.dumps(transcript, ensure_ascii=False)}
""".strip()

    client = OpenAI(base_url=os.environ.get("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"), api_key=os.environ.get("OPENROUTER_API_KEY"))

    try:
        resp = client.chat.completions.create(
            model=os.environ.get("MODEL", MODEL),
            messages=[
                {"role": "system", "content": "Return valid JSON only. Output must be a JSON array with keys start, duration, line."},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            max_tokens=16000,
        )

        content = resp.choices[0].message.content
        if content is None:
            raise ValueError("empty response from model")
        content = content.strip()

        # Helper: try to extract JSON from code fences or by locating the first [ or {
        def extract_json(s: str) -> str:
            import re
            # try ```json
            m = re.search(r"```json\n([\s\S]*?)\n```", s)
            if m:
                return m.group(1).strip()
            m = re.search(r"```\n([\s\S]*?)\n```", s)
            if m:
                return m.group(1).strip()
            # fallback: find first JSON array or object
            first_arr = s.find('[')
            last_arr = s.rfind(']')
            if first_arr != -1 and last_arr != -1 and last_arr > first_arr:
                return s[first_arr:last_arr+1]
            first_obj = s.find('{')
            last_obj = s.rfind('}')
            if first_obj != -1 and last_obj != -1 and last_obj > first_obj:
                return s[first_obj:last_obj+1]
            return s

        json_str = extract_json(content)
        try:
            parsed = json.loads(json_str)
            return parsed
        except Exception as e:
            print(f"ERROR_GENERATION: {e}", file=sys.stderr)
            # surface model content for debugging
            print("--- model raw response start ---", file=sys.stderr)
            print(content, file=sys.stderr)
            print("--- model raw response end ---", file=sys.stderr)
            return None
    except Exception as e:
        print(f"ERROR_GENERATION: {e}", file=sys.stderr)
        # attempt to surface partial content if available
        try:
            if 'resp' in locals() and resp and getattr(resp.choices[0].message, 'content', None):
                print(resp.choices[0].message.content, file=sys.stderr)
        except Exception:
            pass
        return None


def main():
    if len(sys.argv) < 3:
        print("usage: rewrite.py <videoId> <personality>", file=sys.stderr)
        sys.exit(2)

    video_id = sys.argv[1]
    personality = sys.argv[2]

    transcript = fetch_transcript(video_id)
    if not transcript:
        print(json.dumps([]))
        sys.exit(0)

    out = rewrite_transcript(transcript, personality)
    if out is None:
        # on failure, exit non-zero so server can report
        sys.exit(1)

    # print strict JSON
    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()
