declare module 'youtube-captions-scraper' {
  export interface Caption {
    start: string;
    dur: string;
    text: string;
  }

  export function getSubtitles(options: {
    videoID: string;
    lang?: string;
  }): Promise<Caption[]>;
}
