import { useState, memo } from 'react';
import type { POVVideo } from '../../data/coasters.types';
import { VIDEO_ASPECT_RATIO } from '../../data/constants';
import styles from './YouTubeEmbed.module.css';

interface YouTubeEmbedProps {
  video: POVVideo;
}

/**
 * YouTube video embed with play button overlay
 * Lazy loads iframe only when user clicks to play
 */
function YouTubeEmbedComponent({ video }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isPlaying) {
    return (
      <button className={styles.playButton} onClick={() => setIsPlaying(true)}>
        <span className={styles.playIcon}>▶</span>
        🎬 Watch Front-Seat POV Video
      </button>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>🎬 Front-Seat POV</span>
        <button className={styles.closeButton} onClick={() => setIsPlaying(false)}>
          ✕ Close Video
        </button>
      </div>
      <div className={styles.videoWrapper} style={{ paddingTop: VIDEO_ASPECT_RATIO }}>
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.iframe}
        />
      </div>
    </div>
  );
}

export const YouTubeEmbed = memo(YouTubeEmbedComponent);
export default YouTubeEmbed;
