import { useState, useCallback } from 'react';
import { Hero, TabNav, ParkLegend, Footer, type Tab } from './components/layout';
import { CoasterModal } from './components/coaster';
import {
  OverviewSection,
  HeightSpeedSection,
  InversionsSection,
  TracksSection,
  BuildersSection,
  RecordsSection,
  RawDataSection,
} from './components/sections';
import { useCoasterData } from './hooks/useCoasterData';
import type { Coaster } from './data/coasters.types';
import styles from './CoasterDashboard.module.css';

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'height-speed', label: 'Height & Speed' },
  { id: 'inversions', label: "Inversions & G's" },
  { id: 'tracks', label: 'Tracks & Time' },
  { id: 'builders', label: 'Builders & Types' },
  { id: 'records', label: 'Records' },
  { id: 'raw-data', label: 'Raw Data' },
];

/**
 * Main dashboard component
 * Coordinates tab navigation and displays the appropriate section
 */
export default function CoasterDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCoaster, setSelectedCoaster] = useState<Coaster | null>(null);

  const {
    coasters,
    heightData,
    speedData,
    scatterData,
    inversionData,
    parkPieData,
    mfrPieData,
    decadeData,
    trackData,
    timelineData,
    gforceData,
    recordCategories,
  } = useCoasterData();

  const handleSelectCoaster = useCallback((coaster: Coaster) => {
    setSelectedCoaster(coaster);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCoaster(null);
  }, []);

  return (
    <div className={styles.container}>
      <Hero />
      <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <ParkLegend />

      <main className={styles.content}>
        {activeTab === 'overview' && (
          <OverviewSection
            heightData={heightData}
            parkPieData={parkPieData}
            mfrPieData={mfrPieData}
            decadeData={decadeData}
          />
        )}

        {activeTab === 'height-speed' && (
          <HeightSpeedSection scatterData={scatterData} speedData={speedData} />
        )}

        {activeTab === 'inversions' && (
          <InversionsSection inversionData={inversionData} gforceData={gforceData} />
        )}

        {activeTab === 'tracks' && (
          <TracksSection trackData={trackData} timelineData={timelineData} />
        )}

        {activeTab === 'builders' && <BuildersSection mfrPieData={mfrPieData} />}

        {activeTab === 'records' && (
          <RecordsSection
            recordCategories={recordCategories}
            onSelectCoaster={handleSelectCoaster}
          />
        )}

        {activeTab === 'raw-data' && (
          <RawDataSection coasters={coasters} onSelectCoaster={handleSelectCoaster} />
        )}

        <Footer />
      </main>

      <CoasterModal coaster={selectedCoaster} onClose={handleCloseModal} />
    </div>
  );
}
