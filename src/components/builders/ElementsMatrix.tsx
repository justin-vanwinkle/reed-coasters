import { Fragment, memo } from 'react';
import { useCoasterData } from '../../hooks/useCoasterData';
import { ELEMENT_TAGS } from '../../data';
import type { Coaster } from '../../data/coasters.types';
import styles from './ElementsMatrix.module.css';

interface ElementsMatrixProps {
  onSelectCoaster?: (coaster: Coaster) => void;
}

/**
 * Special-elements matrix: a tag-summary header (how many rides have each
 * element) above a compact coaster × element grid. Coaster names are
 * clickable and open the detail modal.
 */
function ElementsMatrixComponent({ onSelectCoaster }: ElementsMatrixProps) {
  const { elementsMatrix, elementTagCounts, getParkColor } = useCoasterData();

  const activeTags = ELEMENT_TAGS.filter((tag) => (elementTagCounts[tag.id] ?? 0) > 0);

  return (
    <div>
      <div className={styles.summary}>
        {activeTags.map((tag) => (
          <div key={tag.id} className={styles.summaryChip}>
            <span className={styles.chipIcon} aria-hidden="true">
              {tag.icon}
            </span>
            <span className={styles.chipLabel}>{tag.label}</span>
            <span className={styles.chipCount}>{elementTagCounts[tag.id]}</span>
          </div>
        ))}
      </div>

      <div className={styles.scroll}>
        <div
          className={styles.matrix}
          style={{
            gridTemplateColumns: `minmax(160px, 1fr) repeat(${activeTags.length}, minmax(34px, 44px))`,
          }}
        >
          <div className={styles.cornerCell} />
          {activeTags.map((tag) => (
            <div key={tag.id} className={styles.colHeader} title={tag.label}>
              <span aria-hidden="true">{tag.icon}</span>
              <span className={styles.srOnly}>{tag.label}</span>
            </div>
          ))}

          {elementsMatrix.map(({ coaster, tagIds }) => (
            <Fragment key={coaster.id}>
              <button
                type="button"
                className={styles.rowName}
                style={{ color: getParkColor(coaster.park) }}
                onClick={() => onSelectCoaster?.(coaster)}
              >
                {coaster.name}
              </button>
              {activeTags.map((tag) => (
                <div key={tag.id} className={styles.cell}>
                  {tagIds.has(tag.id) ? (
                    <span className={styles.hit} title={`${coaster.name}: ${tag.label}`}>
                      {tag.icon}
                    </span>
                  ) : (
                    <span className={styles.miss} aria-hidden="true" />
                  )}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export const ElementsMatrix = memo(ElementsMatrixComponent);
export default ElementsMatrix;
