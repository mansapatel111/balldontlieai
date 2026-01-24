# YouTube Integration Guide

## Overview
Your Ball Don't Lie AI app now supports real YouTube video playback using the YouTube IFrame API!

## What Was Added

### 1. **YouTube Player Component** ([client/src/components/youtube-player.tsx](client/src/components/youtube-player.tsx))
A reusable React component that wraps the YouTube IFrame API with:
- Full TypeScript type definitions for the YT API
- `YouTubePlayer` component for embedding videos
- `useYouTubePlayer` hook for controlling playback
- `extractYouTubeVideoId` utility for parsing YouTube URLs

### 2. **Updated Components**

#### Live Commentary ([client/src/components/live-commentary.tsx](client/src/components/live-commentary.tsx))
- Replaced mock video player with real YouTube player
- Added play/pause controls that sync with YouTube player state
- Shows real-time video progress and duration
- Supports any YouTube video URL

#### Video Input ([client/src/components/video-input.tsx](client/src/components/video-input.tsx))
- Added URL validation for YouTube links
- Shows error message for invalid URLs
- Added placeholder text to guide users

### 3. **Test Page** ([client/public/youtube-test.html](client/public/youtube-test.html))
A standalone HTML test page to verify YouTube API integration works independently.

## How to Use

### In Your App
1. Go to `/studio` route
2. Paste any YouTube URL (supports multiple formats):
   - `https://www.youtube.com/watch?v=HxtInYE2WNA`
   - `https://youtu.be/HxtInYE2WNA`
   - `HxtInYE2WNA` (just the video ID)
3. Click "Start Watching"
4. Select a vibe and voice
5. The video will play with your brainrot commentary!

### Test the API Directly
Open in browser: `http://localhost:5000/youtube-test.html` (after running your dev server)

## Supported YouTube URL Formats
- Full URL: `https://www.youtube.com/watch?v=VIDEO_ID`
- Short URL: `https://youtu.be/VIDEO_ID`
- Embed URL: `https://www.youtube.com/embed/VIDEO_ID`
- Video ID only: `VIDEO_ID`

## API Features Available

The `useYouTubePlayer` hook provides:
```typescript
{
  player: YT.Player | null,      // Raw YouTube player instance
  currentTime: number,             // Current playback time (seconds)
  duration: number,                // Total video duration (seconds)
  isPlaying: boolean,              // Playback state
  play: () => void,                // Start playback
  pause: () => void,               // Pause playback
  seekTo: (seconds: number) => void, // Jump to timestamp
  handleStateChange: (state: number) => void // Handle state changes
}
```

## Player States
```typescript
YT.PlayerState.UNSTARTED = -1
YT.PlayerState.ENDED = 0
YT.PlayerState.PLAYING = 1
YT.PlayerState.PAUSED = 2
YT.PlayerState.BUFFERING = 3
YT.PlayerState.CUED = 5
```

## Next Steps (Optional Enhancements)

1. **Volume Control**: Add volume slider using `player.setVolume()`
2. **Playback Speed**: Add speed controls with `player.setPlaybackRate()`
3. **Quality Selection**: Let users choose video quality
4. **Playlist Support**: Handle multiple videos in sequence
5. **Sync Commentary**: Use `currentTime` to trigger commentary at specific moments
6. **Captions**: Access YouTube captions for AI processing

## Common Issues

### Video Won't Load
- Check if video allows embedding (some creators disable it)
- Verify the video ID is correct
- Look for errors in browser console

### Controls Not Working
- Ensure the API loaded successfully (check Network tab)
- The player needs to be "ready" before calling control functions
- Check that `onReady` callback was triggered

### CORS Issues
- YouTube IFrame API loads from their CDN
- Should work in all modern browsers
- If issues persist, check browser console for blocked requests

## File Structure
```
client/src/components/
├── youtube-player.tsx       # Core YouTube component + hook
├── live-commentary.tsx      # Updated to use YouTube player
└── video-input.tsx          # Updated with URL validation

client/public/
└── youtube-test.html        # Standalone test page
```
