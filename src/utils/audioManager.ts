import { EVENT_DETAILS } from '../data/eventData';

export interface AudioState {
  isPlaying: boolean;
  trackName: string;
  artist: string;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  sourceType: 'file' | 'custom-file' | 'custom-url';
  currentSrc: string;
  hasError: boolean;
  errorMessage?: string;
}

type AudioListener = (state: AudioState) => void;

class AudioFileManager {
  private audio: HTMLAudioElement | null = null;
  private listeners: AudioListener[] = [];
  private state: AudioState = {
    isPlaying: false,
    trackName: EVENT_DETAILS.music?.title || "Memori Baik",
    artist: EVENT_DETAILS.music?.artist || "Sheila On 7",
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    sourceType: 'file',
    currentSrc: EVENT_DETAILS.music?.audioSrc || "/audio/sheila-on-7-memori-baik.mp3",
    hasError: false
  };

  constructor() {
    // Audio element is initialized in browser
    if (typeof window !== 'undefined') {
      this.initAudioElement(this.state.currentSrc);
    }
  }

  private initAudioElement(src: string) {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }

    this.audio = new Audio();
    this.audio.src = src;
    this.audio.loop = true;
    this.audio.volume = this.state.isMuted ? 0 : this.state.volume;
    this.audio.preload = 'metadata';

    this.audio.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.state.hasError = false;
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.notify();
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.state.currentTime = this.audio.currentTime;
        if (this.audio.duration && !isNaN(this.audio.duration)) {
          this.state.duration = this.audio.duration;
        }
        this.notify();
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio && this.audio.duration && !isNaN(this.audio.duration)) {
        this.state.duration = this.audio.duration;
      }
      this.state.hasError = false;
      this.notify();
    });

    this.audio.addEventListener('error', () => {
      this.state.isPlaying = false;
      this.state.hasError = true;
      this.state.errorMessage = "File audio belum ditemukan di path sumber. Anda dapat langsung mengunggah file MP3 Sheila On 7 - Memori Baik melalui tombol di bawah.";
      this.notify();
    });
  }

  private notify() {
    this.listeners.forEach((cb) => cb({ ...this.state }));
  }

  public subscribe(cb: AudioListener) {
    this.listeners.push(cb);
    cb({ ...this.state });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public async play(): Promise<boolean> {
    if (!this.audio) {
      this.initAudioElement(this.state.currentSrc);
    }

    if (!this.audio) return false;

    try {
      this.audio.volume = this.state.isMuted ? 0 : this.state.volume;
      await this.audio.play();
      this.state.isPlaying = true;
      this.state.hasError = false;
      this.notify();
      return true;
    } catch (err) {
      console.warn("Audio play blocked or file not ready yet:", err);
      this.state.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
      this.state.isPlaying = false;
      this.notify();
    }
  }

  public togglePlay() {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public seek(timeInSeconds: number) {
    if (this.audio && !isNaN(timeInSeconds)) {
      this.audio.currentTime = timeInSeconds;
      this.state.currentTime = timeInSeconds;
      this.notify();
    }
  }

  public setVolume(val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    this.state.volume = clamped;
    if (this.audio) {
      this.audio.volume = this.state.isMuted ? 0 : clamped;
    }
    this.notify();
  }

  public toggleMute() {
    this.state.isMuted = !this.state.isMuted;
    if (this.audio) {
      this.audio.volume = this.state.isMuted ? 0 : this.state.volume;
    }
    this.notify();
  }

  public setCustomFile(file: File) {
    const objectUrl = URL.createObjectURL(file);
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    this.state.trackName = fileName.toLowerCase().includes("memori") ? "Memori Baik" : fileName;
    this.state.artist = fileName.toLowerCase().includes("sheila") ? "Sheila On 7" : "File Pilihan Anda";
    this.state.sourceType = 'custom-file';
    this.state.currentSrc = objectUrl;
    this.state.hasError = false;

    this.initAudioElement(objectUrl);
    this.play();
  }

  public setCustomUrl(url: string, title: string = "Memori Baik", artist: string = "Sheila On 7") {
    this.state.trackName = title;
    this.state.artist = artist;
    this.state.sourceType = 'custom-url';
    this.state.currentSrc = url;
    this.state.hasError = false;

    this.initAudioElement(url);
    this.play();
  }

  public resetToDefaultFile() {
    this.state.trackName = EVENT_DETAILS.music?.title || "Memori Baik";
    this.state.artist = EVENT_DETAILS.music?.artist || "Sheila On 7";
    this.state.sourceType = 'file';
    this.state.currentSrc = EVENT_DETAILS.music?.audioSrc || "/audio/sheila-on-7-memori-baik.mp3";
    this.state.hasError = false;

    this.initAudioElement(this.state.currentSrc);
    this.play();
  }

  public getState(): AudioState {
    return { ...this.state };
  }
}

export const audioManager = new AudioFileManager();
