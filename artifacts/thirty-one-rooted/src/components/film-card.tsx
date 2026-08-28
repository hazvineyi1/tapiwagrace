import { useState } from 'react';
import { Play } from 'lucide-react';

import type { Film } from '@/lib/retreats';

/**
 * Poster first, video only once asked for. Nothing is fetched until the
 * visitor presses play, which keeps three clips off the initial page weight,
 * and the films are served from our own origin so no third party is involved.
 */
export function FilmCard({ film }: { film: Film }) {
  const [playing, setPlaying] = useState(false);
  const base = import.meta.env.BASE_URL;

  if (playing) {
    return (
      <figure className="film-card">
        {/* MP4 first — every consumer browser takes it. The WebM covers the
            builds shipped without the H.264 decoder. */}
        <video
          poster={`${base}films/${film.poster}`}
          controls
          autoPlay
          playsInline
          preload="auto"
          data-testid={`film-video-${film.file}`}
        >
          <source src={`${base}films/${film.file}`} type="video/mp4" />
          <source src={`${base}films/${film.webm}`} type="video/webm" />
        </video>
        <figcaption>{film.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="film-card">
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="film-card-trigger group"
        data-testid={`film-play-${film.file}`}
      >
        <img src={`${base}films/${film.poster}`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span className="film-card-scrim" aria-hidden="true" />
        <span className="film-card-play" aria-hidden="true"><Play size={18} strokeWidth={1.5} /></span>
        <span className="sr-only">Play film: {film.caption}</span>
      </button>
      <figcaption>{film.caption}</figcaption>
    </figure>
  );
}
