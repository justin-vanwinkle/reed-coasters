/**
 * Core coaster data types
 * Single source of truth for all coaster-related interfaces
 */

export interface POVVideo {
  id: string;
  title: string;
}

export interface Coaster {
  id: string;
  name: string;
  park: string;
  parkGroup: string;
  manufacturer: string;
  manufacturerShort: string;
  yearOpened: number | null;
  coasterType: string;
  height: number | null;
  drop: number | null;
  dropAngle: number | null;
  speed: number | null;
  trackLength: number | null;
  duration: string | null;
  inversions: number;
  maxGForce: number | null;
  specialElements: string | null;
  records: string | null;
  timesRidden: number | null;
  reedsAgeOnFirstRide: number | null;
  imageUrl: string | null;
  povVideo: POVVideo | null;
}

export interface CoasterStats {
  totalCoasters: number;
  totalTrack: number;
  totalInversions: number;
  maxHeight: number;
  maxSpeed: number;
  maxGForce: number;
  avgSpeed: number;
  parkCounts: Record<string, number>;
  mfrCounts: Record<string, number>;
  decadeCounts: Record<string, number>;
}

// Chart data types
export interface HeightDataPoint {
  name: string;
  fullName: string;
  height: number;
  fill: string;
  park: string;
}

export interface SpeedDataPoint {
  name: string;
  fullName: string;
  speed: number;
  fill: string;
  park: string;
}

export interface ScatterDataPoint {
  name: string;
  x: number;
  y: number;
  z: number;
  fill: string;
  park: string;
  track: number | null;
}

export interface InversionDataPoint {
  name: string;
  inversions: number;
  fill: string;
  park: string;
}

export interface PieDataPoint {
  name: string;
  value: number;
  fill: string;
}

export interface TimelineDataPoint {
  name: string;
  year: number;
  height: number;
  speed: number;
  fill: string;
  park: string;
}

export interface TrackDataPoint {
  name: string;
  fullName: string;
  track: number;
  fill: string;
  park: string;
}

export interface GForceDataPoint {
  name: string;
  gforce: number;
  fill: string;
}

export interface DecadeDataPoint {
  name: string;
  count: number;
}

export interface RecordCategory {
  id: string;
  title: string;
  field: keyof Coaster;
  unit: string;
  icon: string;
  data: Coaster[];
}
