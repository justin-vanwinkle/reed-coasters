import { memo } from 'react';
import type { KeyboardEvent } from 'react';
import {
  skylineData,
  SKYLINE_EXCLUDED,
  REFERENCE_OBJECTS,
  findCoasterById,
} from '../../data';
import type { ReferenceObject } from '../../data';
import type { Coaster, SkylinePoint } from '../../data/coasters.types';
import styles from './SkylineChart.module.css';

interface SkylineChartProps {
  onSelectCoaster: (coaster: Coaster) => void;
}

// ---- Layout constants ------------------------------------------------------
const ITEM_WIDTH = 90;
const SVG_HEIGHT = 430;
const GROUND_Y = 380;
const PX_PER_FT = 340 / 325; // tallest coaster (325 ft) ≈ 340px tall
const GRIDLINES_FT = [100, 200, 300];

type SkylineItem =
  | ({ type: 'coaster' } & SkylinePoint)
  | ({ type: 'ref' } & ReferenceObject);

// Coasters + reference silhouettes, merged and sorted tallest-first
const ITEMS: SkylineItem[] = [
  ...skylineData.map((d) => ({ type: 'coaster' as const, ...d })),
  ...REFERENCE_OBJECTS.map((r) => ({ type: 'ref' as const, ...r })),
].sort((a, b) => b.height - a.height);

const SVG_WIDTH = ITEMS.length * ITEM_WIDTH;

const UNIQUE_FILLS = Array.from(new Set(skylineData.map((d) => d.fill)));

const gradientId = (fill: string) => `skyline-grad-${fill.replace(/[^a-zA-Z0-9]/g, '')}`;

const ftToY = (ft: number) => GROUND_Y - ft * PX_PER_FT;

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Stylized lift-hill silhouette in local slot coordinates (0..ITEM_WIDTH):
 * straight lift slope up to a rounded crest, a steeper quadratic drop into a
 * small valley, a low second bump, then closed along the ground line.
 */
function hillPath(heightPx: number): string {
  const peakY = GROUND_Y - heightPx;
  const crestX = 52;
  const valleyX = 66;
  const valleyY = GROUND_Y - Math.min(10, heightPx * 0.08);
  const bumpHeight = Math.min(heightPx * 0.35, 56);
  return [
    `M 8 ${GROUND_Y}`,
    `L ${crestX - 8} ${r1(peakY + 5)}`, // lift slope
    `Q ${crestX} ${r1(peakY)} ${crestX + 6} ${r1(peakY + 7)}`, // rounded crest
    `Q ${crestX + 9} ${r1(peakY + heightPx * 0.55)} ${valleyX} ${r1(valleyY)}`, // steep drop
    `Q ${valleyX + 8} ${r1(GROUND_Y - bumpHeight)} ${valleyX + 16} ${GROUND_Y}`, // second bump
    'Z',
  ].join(' ');
}

// ---- Reference silhouettes (muted gray, not clickable) ---------------------

function StatueSilhouette({ heightPx }: { heightPx: number }) {
  const top = GROUND_Y - heightPx;
  const pedestalTop = GROUND_Y - heightPx * 0.42;
  const bodyTop = GROUND_Y - heightPx * 0.85;
  return (
    <>
      {/* base slab + pedestal */}
      <rect className={styles.refShape} x={28} y={r1(GROUND_Y - heightPx * 0.06)} width={34} height={r1(heightPx * 0.06)} />
      <rect className={styles.refShape} x={33} y={r1(pedestalTop)} width={24} height={r1(heightPx * 0.42)} />
      {/* body (robed figure, slight taper) */}
      <polygon
        className={styles.refShape}
        points={`38,${r1(pedestalTop)} 52,${r1(pedestalTop)} 50,${r1(bodyTop)} 40,${r1(bodyTop)}`}
      />
      {/* head */}
      <circle className={styles.refShape} cx={45} cy={r1(bodyTop - heightPx * 0.035)} r={r1(heightPx * 0.035)} />
      {/* raised torch arm reaching full height */}
      <polygon
        className={styles.refShape}
        points={`49,${r1(bodyTop + heightPx * 0.07)} 53,${r1(bodyTop + heightPx * 0.04)} 59,${r1(top + heightPx * 0.012)} 55,${r1(top)}`}
      />
    </>
  );
}

function HouseSilhouette({ heightPx }: { heightPx: number }) {
  const top = GROUND_Y - heightPx;
  const boxTop = GROUND_Y - heightPx * 0.55;
  return (
    <>
      {/* chimney (drawn first so the roof edge overlays its base) */}
      <rect className={styles.refShape} x={53} y={r1(top + 2)} width={5} height={r1(boxTop - top - 2)} />
      {/* box */}
      <rect className={styles.refShape} x={28} y={r1(boxTop)} width={34} height={r1(heightPx * 0.55)} />
      {/* triangle roof, apex at full height */}
      <polygon className={styles.refShape} points={`24,${r1(boxTop)} 66,${r1(boxTop)} 45,${r1(top)}`} />
    </>
  );
}

// ---- Chart -----------------------------------------------------------------

function SkylineChartComponent({ onSelectCoaster }: SkylineChartProps) {
  const handleSelect = (id: string) => {
    const coaster = findCoasterById(id);
    if (coaster) onSelectCoaster(coaster);
  };

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chartArea}>
        <div className={styles.scroller}>
          <svg
            className={styles.svg}
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            role="img"
            aria-label="The Skyline — every coaster lift hill drawn to scale"
          >
            <defs>
              {UNIQUE_FILLS.map((fill) => (
                <linearGradient key={fill} id={gradientId(fill)} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={fill} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={fill} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>

            {/* horizontal gridlines every 100 ft */}
            {GRIDLINES_FT.map((ft) => (
              <line
                key={ft}
                className={styles.gridline}
                x1={0}
                x2={SVG_WIDTH}
                y1={r1(ftToY(ft))}
                y2={r1(ftToY(ft))}
              />
            ))}

            {/* shared ground line */}
            <line className={styles.groundLine} x1={0} x2={SVG_WIDTH} y1={GROUND_Y} y2={GROUND_Y} />

            {ITEMS.map((item, i) => {
              const heightPx = item.height * PX_PER_FT;
              const peakY = GROUND_Y - heightPx;
              const translate = `translate(${i * ITEM_WIDTH}, 0)`;

              if (item.type === 'ref') {
                return (
                  <g
                    key={item.name}
                    transform={translate}
                    className={styles.refGroup}
                    data-testid={`skyline-ref-${item.kind}`}
                    aria-label={`${item.name}, ${item.height} feet, for scale`}
                  >
                    <title>{`${item.name} — ${item.height} ft (for scale)`}</title>
                    {item.kind === 'statue' ? (
                      <StatueSilhouette heightPx={heightPx} />
                    ) : (
                      <HouseSilhouette heightPx={heightPx} />
                    )}
                    <text className={styles.refPeakLabel} x={45} y={r1(peakY - 8)} textAnchor="middle">
                      {item.height} ft
                    </text>
                    <text
                      className={styles.refNameLabel}
                      x={14}
                      y={GROUND_Y - 6}
                      transform={`rotate(-90, 14, ${GROUND_Y - 6})`}
                    >
                      {item.name}
                    </text>
                  </g>
                );
              }

              return (
                <g
                  key={item.id}
                  transform={translate}
                  className={styles.coasterGroup}
                  data-testid={`skyline-coaster-${item.id}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${item.name}, ${item.height} feet, ${item.park}`}
                  onClick={() => handleSelect(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                >
                  <title>{`${item.name} — ${item.height} ft — ${item.park}`}</title>
                  <path
                    className={styles.hillFill}
                    d={hillPath(heightPx)}
                    fill={`url(#${gradientId(item.fill)})`}
                    stroke={item.fill}
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                  <text className={styles.peakLabel} x={52} y={r1(peakY - 8)} textAnchor="middle">
                    {item.height} ft
                  </text>
                  <text
                    className={styles.nameLabel}
                    x={14}
                    y={GROUND_Y - 6}
                    transform={`rotate(-90, 14, ${GROUND_Y - 6})`}
                  >
                    {item.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* sticky ft-axis overlay (outside the scrolling area) */}
        <div className={styles.axis} aria-hidden="true">
          {GRIDLINES_FT.map((ft) => (
            <span key={ft} className={styles.axisLabel} style={{ top: r1(ftToY(ft)) - 7 }}>
              {ft} ft
            </span>
          ))}
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          scroll →
        </div>
      </div>

      {SKYLINE_EXCLUDED.length > 0 && (
        <p className={styles.footnote}>
          Not pictured: {SKYLINE_EXCLUDED.join(', ')} (height unknown).
        </p>
      )}
    </div>
  );
}

export const SkylineChart = memo(SkylineChartComponent);
export default SkylineChart;
