# Story 03-014: Setup GCP Cloud Storage for Audio

## Story

**As a** developer
**I want** audio files hosted on GCP Cloud Storage
**So that** letter sounds load reliably with proper caching and CDN delivery

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Configure GCP Cloud Storage bucket for hosting letter audio files (A-Z) and feedback sounds. Set up proper CORS, caching headers, and public access for optimal performance.

## Acceptance Criteria

- [ ] GCP Cloud Storage bucket created
- [ ] Audio files uploaded (26 letters + feedback sounds)
- [ ] CORS configured for app domains
- [ ] Cache headers set for optimal performance
- [ ] Audio player service uses GCP URLs
- [ ] Fallback for offline cached audio

## Technical Details

### Bucket Structure

```
neuralift-assets/
├── audio/
│   ├── letters/
│   │   ├── a.mp3
│   │   ├── b.mp3
│   │   ├── c.mp3
│   │   └── ... (A-Z)
│   └── feedback/
│       ├── correct.mp3
│       ├── incorrect.mp3
│       └── complete.mp3
└── images/
    └── (future static assets)
```

### GCP Configuration

```bash
# Create bucket with uniform access
gsutil mb -p YOUR_PROJECT_ID -l US -b on gs://neuralift-assets

# Set public read access
gsutil iam ch allUsers:objectViewer gs://neuralift-assets

# Configure CORS
cat > cors.json << 'EOF'
[
  {
    "origin": [
      "http://localhost:3000",
      "https://neuralift.app",
      "https://*.netlify.app"
    ],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Content-Length", "Cache-Control"],
    "maxAgeSeconds": 3600
  }
]
EOF
gsutil cors set cors.json gs://neuralift-assets

# Set cache headers for audio files (cache for 1 year)
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://neuralift-assets/audio/**
```

### Audio Service Configuration

```typescript
// src/infrastructure/audio/GCPAudioPlayer.ts
import type { IAudioPlayer } from '@neuralift/core';

const GCP_BASE_URL = process.env.NEXT_PUBLIC_GCP_STORAGE_URL;

export class GCPAudioPlayer implements IAudioPlayer {
  private audioCache = new Map<string, HTMLAudioElement>();
  private preloadPromises = new Map<string, Promise<void>>();

  private getAudioUrl(letter: string): string {
    return `${GCP_BASE_URL}/audio/letters/${letter.toLowerCase()}.mp3`;
  }

  private getFeedbackUrl(type: 'correct' | 'incorrect' | 'complete'): string {
    return `${GCP_BASE_URL}/audio/feedback/${type}.mp3`;
  }

  async preload(letters: string[]): Promise<void> {
    const promises = letters.map(letter => this.preloadLetter(letter));
    await Promise.all(promises);
  }

  private async preloadLetter(letter: string): Promise<void> {
    const url = this.getAudioUrl(letter);

    if (this.preloadPromises.has(url)) {
      return this.preloadPromises.get(url);
    }

    const promise = new Promise<void>((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'auto';

      audio.oncanplaythrough = () => {
        this.audioCache.set(url, audio);
        resolve();
      };

      audio.onerror = () => {
        console.warn(`Failed to preload audio: ${url}`);
        resolve(); // Don't fail entire preload for one file
      };

      audio.src = url;
      audio.load();
    });

    this.preloadPromises.set(url, promise);
    return promise;
  }

  async playLetter(letter: string): Promise<void> {
    const url = this.getAudioUrl(letter);
    return this.playAudio(url);
  }

  async playFeedback(type: 'correct' | 'incorrect' | 'complete'): Promise<void> {
    const url = this.getFeedbackUrl(type);
    return this.playAudio(url);
  }

  private async playAudio(url: string): Promise<void> {
    let audio = this.audioCache.get(url);

    if (!audio) {
      audio = new Audio(url);
      this.audioCache.set(url, audio);
    }

    audio.currentTime = 0;

    try {
      await audio.play();
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  }

  setVolume(volume: number): void {
    const normalizedVolume = Math.max(0, Math.min(1, volume / 100));
    this.audioCache.forEach(audio => {
      audio.volume = normalizedVolume;
    });
  }

  stop(): void {
    this.audioCache.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}
```

### Service Worker Caching (Optional)

```typescript
// For offline support, cache audio in service worker
// public/sw.js (excerpt)
const AUDIO_CACHE = 'neuralift-audio-v1';

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cache GCP audio files
  if (url.hostname === 'storage.googleapis.com' &&
      url.pathname.includes('/audio/')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;

        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(AUDIO_CACHE).then(cache => {
            cache.put(event.request, clone);
          });
          return response;
        });
      })
    );
  }
});
```

### Audio File Requirements

| File | Duration | Format | Size Target |
|------|----------|--------|-------------|
| Letters (A-Z) | ~0.5s | MP3 128kbps | <10KB each |
| correct.mp3 | ~0.3s | MP3 128kbps | <5KB |
| incorrect.mp3 | ~0.3s | MP3 128kbps | <5KB |
| complete.mp3 | ~1.0s | MP3 128kbps | <15KB |

## Tasks

- [ ] Create GCP Cloud Storage bucket
- [ ] Upload letter audio files (A-Z)
- [ ] Upload feedback audio files
- [ ] Configure CORS for app domains
- [ ] Set cache headers for long-term caching
- [ ] Create GCPAudioPlayer implementation
- [ ] Test audio loading and playback
- [ ] Document bucket setup in README

## Dependencies

- Story 01-010 (Environment Variables - GCP URL)
- Story 01-005 (Port Interfaces - IAudioPlayer)

## Notes

- Use Google Cloud Console or gsutil CLI
- Audio files should be high-quality but compressed
- Consider using Web Audio API for lower latency in future
- Service worker caching enables offline playback
- CDN is automatically enabled for public buckets
