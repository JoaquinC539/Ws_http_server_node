export {}
declare global {
    interface Window {
        askImage: () => void;
        askVideo: () => void;
        askVideoNoRange: () => void
        askvideoHls: () => void;
         Hls:{
            isSupported:() => boolean
            new (): HlsInstance;
        }
    }
}
interface HlsInstance {
  loadSource(url: string): void;
  attachMedia(media: HTMLMediaElement): void;
  on(event: string, callback: (...args: any[]) => void): void;
  destroy(): void;
}