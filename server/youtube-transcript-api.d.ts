declare module 'youtube-transcript-api' {
  export default class TranscriptClient {
    getTranscript(videoId: string): Promise<Array<{
      start: string;
      text: string;
      duration: string;
    }>>;
  }
}
