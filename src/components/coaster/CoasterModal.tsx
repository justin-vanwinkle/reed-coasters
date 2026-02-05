import { memo, useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { YouTubeEmbed } from './YouTubeEmbed';
import { getParkColor } from '../../data';
import type { Coaster } from '../../data/coasters.types';
import styles from './CoasterModal.module.css';

interface CoasterModalProps {
  coaster: Coaster | null;
  onClose: () => void;
}

const KEY_STATS: { key: keyof Coaster; label: string }[] = [
  { key: 'height', label: 'Height' },
  { key: 'speed', label: 'Speed' },
  { key: 'drop', label: 'Drop' },
  { key: 'inversions', label: 'Inversions' },
  { key: 'yearOpened', label: 'Year' },
  { key: 'maxGForce', label: 'G-Force' },
];

const DETAIL_FIELDS: { key: keyof Coaster; label: string }[] = [
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'trackLength', label: 'Track Length' },
  { key: 'duration', label: 'Duration' },
  { key: 'specialElements', label: 'Special Elements' },
  { key: 'records', label: 'Records & Awards' },
];

/**
 * Full detail modal for a single coaster
 * Includes hero image, stats grid, POV video, and detailed information
 */
function CoasterModalComponent({ coaster, onClose }: CoasterModalProps) {
  const [showVideo, setShowVideo] = useState(false);

  // Reset video state when coaster changes
  useEffect(() => {
    setShowVideo(false);
  }, [coaster?.id]);

  if (!coaster) return null;

  const parkColor = getParkColor(coaster.park);

  return (
    <Modal isOpen={!!coaster} onClose={onClose}>
      {/* Hero Image */}
      <div
        className={styles.hero}
        style={
          {
            '--park-color': parkColor,
            '--park-color-light': `${parkColor}44`,
          } as React.CSSProperties
        }
      >
        {coaster.imageUrl && (
          <img
            src={coaster.imageUrl}
            alt={coaster.name}
            className={styles.heroImage}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          ×
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h2 className={styles.title}>{coaster.name}</h2>
        <p className={styles.subtitle} style={{ color: parkColor }}>
          {coaster.park} · {coaster.coasterType}
        </p>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {KEY_STATS.map(({ key, label }) => {
            const value = coaster[key];
            if (value === null || value === undefined || value === 0) return null;
            return (
              <div key={key} className={styles.statCard}>
                <div className={styles.statValue}>{value}</div>
                <div className={styles.statLabel}>{label}</div>
              </div>
            );
          })}
        </div>

        {/* POV Video */}
        {coaster.povVideo && (
          <div className={styles.videoSection}>
            <YouTubeEmbed video={coaster.povVideo} />
          </div>
        )}

        {/* Details */}
        <div className={styles.details}>
          {DETAIL_FIELDS.map(({ key, label }) => {
            const value = coaster[key];
            if (!value) return null;
            return (
              <div key={key} className={styles.detailRow}>
                <span className={styles.detailLabel} style={{ color: parkColor }}>
                  {label}:
                </span>{' '}
                <span className={styles.detailValue}>
                  {key === 'trackLength' ? `${(value as number).toLocaleString()} ft` : value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Times Ridden */}
        {coaster.timesRidden && (
          <div className={styles.timesRidden} style={{ background: `${parkColor}15`, borderColor: `${parkColor}33`, color: parkColor }}>
            Reed has ridden this {coaster.timesRidden} time{coaster.timesRidden !== 1 ? 's' : ''}
            {coaster.reedsAgeOnFirstRide && (
              <span className={styles.firstRideAge}>
                {' '}· First rode at age {coaster.reedsAgeOnFirstRide}
              </span>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export const CoasterModal = memo(CoasterModalComponent);
export default CoasterModal;
