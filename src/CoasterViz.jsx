import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, CartesianGrid, AreaChart, Area, ComposedChart, Line } from "recharts";
import csvData from '../Reeds_Roller_Coaster_Database.csv?raw';

// ── CSV PARSING ──
const parseCSV = (csv) => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.match(/(".*?"|[^,]+)(?=,|$)/g) || [];
    return headers.reduce((obj, header, i) => {
      obj[header] = (values[i] || '').replace(/^"|"$/g, '').trim();
      return obj;
    }, {});
  });
};

const rawCoasterData = parseCSV(csvData);

// ── DATA ──
const PARK_COLORS = {
  "Kings Island": "#4ECDC4",
  "Hollywood Studios": "#FFD93D",
  "Magic Kingdom": "#FFD93D",
  "EPCOT": "#FFD93D",
  "Animal Kingdom": "#FFD93D",
  "Carowinds": "#6BCB77",
  "Busch Gardens Tampa": "#FF6B6B",
  "SeaWorld Orlando": "#4D96FF",
  "Jellystone Park": "#C084FC",
};

const PARK_GROUPS = {
  "Kings Island": "#4ECDC4",
  "Walt Disney World": "#FFD93D",
  "Carowinds": "#6BCB77",
  "Busch Gardens Tampa": "#FF6B6B",
  "SeaWorld Orlando": "#4D96FF",
  "Jellystone Park": "#C084FC",
};

const MFR_COLORS = {
  "B&M": "#FF6B6B",
  "Vekoma": "#4D96FF",
  "Arrow": "#FFD93D",
  "PTC": "#4ECDC4",
  "Premier": "#C084FC",
  "Intamin": "#FF9A3C",
  "GCI": "#6BCB77",
  "RMC": "#FF4081",
  "Mack": "#00BFA5",
  "Wiegand": "#8E99A4",
};

// ── POV VIDEO IDS (YouTube) ──
// Verified front-seat POV videos for each coaster
const POV_VIDEOS = {
  // Kings Island
  "The Beast": { id: "tvGDC1vJLaQ", title: "The Beast POV - Kings Island (Official)" },
  "Mystic Timbers": { id: "7bMWLgLZHIk", title: "Mystic Timbers POV - Kings Island" },
  "The Bat": { id: "aS0tspdvo7c", title: "The Bat POV - Kings Island" },
  "Backlot Stunt Coaster": { id: "4v6paKuFDv0", title: "Backlot Stunt Coaster POV - Kings Island" },
  "The Racer": { id: "hIL-gZTftPk", title: "The Racer POV - Kings Island" },
  "Woodstock Express": { id: "k2tz_SSnID4", title: "Woodstock Express POV - Kings Island" },
  // Walt Disney World
  "Rock 'n' Roller Coaster": { id: "3kPGnGb7E9M", title: "Rock 'n' Roller Coaster POV - Hollywood Studios" },
  "Seven Dwarfs Mine Train": { id: "8T0wAi0gMvM", title: "Seven Dwarfs Mine Train POV - Magic Kingdom" },
  "Slinky Dog Dash": { id: "6KERUB0PqjI", title: "Slinky Dog Dash POV - Hollywood Studios" },
  "Expedition Everest": { id: "WYhAu4OhhZ4", title: "Expedition Everest POV - Animal Kingdom" },
  "The Barnstormer": { id: "aZR5pFnNJsU", title: "The Barnstormer POV - Magic Kingdom" },
  "Big Thunder Mountain Railroad": { id: "uzHbyQh2kRw", title: "Big Thunder Mountain POV - Magic Kingdom" },
  "Guardians of the Galaxy: Cosmic Rewind": { id: "HlBRVamVhDM", title: "Cosmic Rewind POV - EPCOT" },
  // Carowinds
  "Fury 325": { id: "Ry8UYr7wg64", title: "Fury 325 POV - Carowinds" },
  "Thunder Striker": { id: "fTh_qfYvqpw", title: "Thunder Striker (Intimidator) POV - Carowinds" },
  "Carolina Cyclone": { id: "5_0H5HZQDTQ", title: "Carolina Cyclone POV - Carowinds" },
  "Ricochet": { id: "VwVJNNKLhP8", title: "Ricochet POV - Carowinds" },
  // Busch Gardens Tampa
  "Montu": { id: "j0kw80_5xhM", title: "Montu POV - Busch Gardens Tampa" },
  "SheiKra": { id: "hMnWfk1zYSE", title: "SheiKra POV - Busch Gardens Tampa" },
  "Iron Gwazi": { id: "TQX7DEPyoBA", title: "Iron Gwazi POV - Busch Gardens Tampa (Official)" },
  "Kumba": { id: "hMJ2ti4RnHk", title: "Kumba POV - Busch Gardens Tampa" },
  "Phoenix Rising": { id: "3EqD7eveKtM", title: "Phoenix Rising POV - Busch Gardens Tampa" },
  "Tigris": { id: "qF6kLKHvNw8", title: "Tigris POV - Busch Gardens Tampa" },
  "Cheetah Hunt": { id: "KyCbp5N2qJs", title: "Cheetah Hunt POV - Busch Gardens Tampa" },
  // SeaWorld Orlando
  "Mako": { id: "lGKq_dpMLlQ", title: "Mako POV - SeaWorld Orlando" },
  "Pipeline: The Surf Coaster": { id: "BLvC3xNnKXk", title: "Pipeline Surf Coaster POV - SeaWorld Orlando" },
  "Kraken": { id: "oOWAf_Rlm4w", title: "Kraken POV - SeaWorld Orlando" },
  // Other
  "Blue Ridge Mountain Coaster": { id: "k5f8ZT8bMrs", title: "Blue Ridge Mountain Coaster POV" },
};

const coasters = [
  { name: "The Beast", park: "Kings Island", mfr: "PTC", year: 1979, type: "Wooden", height: 110, drop: 141, speed: 65, track: 7361, duration: "4:10", inversions: 0, gforce: 3.8, dropAngle: 18 },
  { name: "Mystic Timbers", park: "Kings Island", mfr: "GCI", year: 2017, type: "Wooden", height: 109, drop: 98, speed: 53, track: 3265, duration: "2:40", inversions: 0, gforce: null, dropAngle: null },
  { name: "The Bat", park: "Kings Island", mfr: "Arrow", year: 1993, type: "Suspended", height: 98, drop: 70, speed: 51, track: 2352, duration: "2:30", inversions: 0, gforce: null, dropAngle: null },
  { name: "Backlot Stunt Coaster", park: "Kings Island", mfr: "Premier", year: 2005, type: "Launch", height: 45, drop: null, speed: 40, track: 1880, duration: "2:00", inversions: 0, gforce: null, dropAngle: null },
  { name: "The Racer", park: "Kings Island", mfr: "PTC", year: 1972, type: "Wooden", height: 88, drop: 83, speed: 53, track: 3415, duration: "2:30", inversions: 0, gforce: null, dropAngle: null },
  { name: "Woodstock Express", park: "Kings Island", mfr: "Vekoma", year: 1972, type: "Junior", height: 33, drop: 30, speed: 25, track: 1050, duration: "1:30", inversions: 0, gforce: null, dropAngle: null },
  { name: "Rock 'n' Roller Coaster", park: "Hollywood Studios", mfr: "Vekoma", year: 1999, type: "Launch (Indoor)", height: 80, drop: null, speed: 57, track: 3403, duration: "1:22", inversions: 3, gforce: 5.0, dropAngle: null },
  { name: "Seven Dwarfs Mine Train", park: "Magic Kingdom", mfr: "Vekoma", year: 2014, type: "Mine Train", height: 39, drop: 39, speed: 34, track: 2526, duration: "2:30", inversions: 0, gforce: null, dropAngle: null },
  { name: "Slinky Dog Dash", park: "Hollywood Studios", mfr: "Mack", year: 2018, type: "Launch", height: 50, drop: 50, speed: 40, track: 1813, duration: "2:00", inversions: 0, gforce: null, dropAngle: null },
  { name: "Expedition Everest", park: "Animal Kingdom", mfr: "Vekoma", year: 2006, type: "Steel (Fwd/Rev)", height: 112, drop: 80, speed: 50, track: 4424, duration: "2:50", inversions: 0, gforce: null, dropAngle: null },
  { name: "Barnstormer", park: "Magic Kingdom", mfr: "Vekoma", year: 1996, type: "Junior", height: 30, drop: 30, speed: 25, track: 680, duration: "1:03", inversions: 0, gforce: null, dropAngle: null },
  { name: "Big Thunder Mountain", park: "Magic Kingdom", mfr: "Vekoma", year: 1980, type: "Mine Train", height: 39, drop: 35, speed: 35, track: 2780, duration: "3:30", inversions: 0, gforce: null, dropAngle: null },
  { name: "Cosmic Rewind", park: "EPCOT", mfr: "Vekoma", year: 2022, type: "Omnicoaster", height: 65, drop: null, speed: 60, track: 4769, duration: "3:00", inversions: 0, gforce: null, dropAngle: null },
  { name: "Blue Ridge Mtn Coaster", park: "Jellystone Park", mfr: "Wiegand", year: null, type: "Alpine", height: null, drop: null, speed: 27, track: null, duration: "5:00", inversions: 0, gforce: null, dropAngle: null },
  { name: "Woodstock Express (CW)", park: "Carowinds", mfr: "Vekoma", year: 2001, type: "Junior", height: 35, drop: 20, speed: 25, track: 900, duration: "1:30", inversions: 0, gforce: null, dropAngle: null },
  { name: "Fury 325", park: "Carowinds", mfr: "B&M", year: 2015, type: "Giga", height: 325, drop: 320, speed: 95, track: 6602, duration: "3:25", inversions: 0, gforce: null, dropAngle: 81 },
  { name: "Thunder Striker", park: "Carowinds", mfr: "B&M", year: 2010, type: "Hyper", height: 232, drop: 211, speed: 80, track: 5316, duration: "3:22", inversions: 0, gforce: null, dropAngle: 74 },
  { name: "Carolina Cyclone", park: "Carowinds", mfr: "Arrow", year: 1980, type: "Looping", height: 95, drop: 65, speed: 41, track: 2100, duration: "2:15", inversions: 4, gforce: null, dropAngle: null },
  { name: "Ricochet", park: "Carowinds", mfr: "Mack", year: 2002, type: "Wild Mouse", height: 46, drop: null, speed: 28, track: 1214, duration: "1:45", inversions: 0, gforce: null, dropAngle: null },
  { name: "Montu", park: "Busch Gardens Tampa", mfr: "B&M", year: 1996, type: "Inverted", height: 150, drop: 128, speed: 60, track: 3983, duration: "3:00", inversions: 7, gforce: 3.85, dropAngle: null },
  { name: "SheiKra", park: "Busch Gardens Tampa", mfr: "B&M", year: 2005, type: "Dive", height: 200, drop: 200, speed: 70, track: 3188, duration: "2:50", inversions: 1, gforce: null, dropAngle: 90 },
  { name: "Iron Gwazi", park: "Busch Gardens Tampa", mfr: "RMC", year: 2022, type: "Hybrid", height: 206, drop: 206, speed: 76, track: 4075, duration: "2:00", inversions: 3, gforce: null, dropAngle: 91 },
  { name: "Kumba", park: "Busch Gardens Tampa", mfr: "B&M", year: 1993, type: "Sit-Down Looping", height: 143, drop: 135, speed: 60, track: 3978, duration: "2:54", inversions: 7, gforce: 3.8, dropAngle: null },
  { name: "Phoenix Rising", park: "Busch Gardens Tampa", mfr: "B&M", year: 2024, type: "Family Inverted", height: 80, drop: null, speed: 44, track: 1831, duration: "2:00", inversions: 0, gforce: null, dropAngle: null },
  { name: "Tigris", park: "Busch Gardens Tampa", mfr: "Premier", year: 2019, type: "Triple Launch", height: 150, drop: 135, speed: 62, track: 1800, duration: "1:30", inversions: 1, gforce: null, dropAngle: null },
  { name: "Cheetah Hunt", park: "Busch Gardens Tampa", mfr: "Intamin", year: 2011, type: "LSM Launch", height: 102, drop: 130, speed: 60, track: 4429, duration: "3:30", inversions: 1, gforce: null, dropAngle: null },
  { name: "Mako", park: "SeaWorld Orlando", mfr: "B&M", year: 2016, type: "Hyper", height: 200, drop: 200, speed: 73, track: 4760, duration: "2:50", inversions: 0, gforce: null, dropAngle: null },
  { name: "Pipeline", park: "SeaWorld Orlando", mfr: "B&M", year: 2023, type: "Surf Coaster", height: 110, drop: 110, speed: 60, track: 2950, duration: "2:00", inversions: 1, gforce: null, dropAngle: null },
  { name: "Kraken", park: "SeaWorld Orlando", mfr: "B&M", year: 2000, type: "Floorless", height: 153, drop: 144, speed: 65, track: 4177, duration: "2:50", inversions: 7, gforce: null, dropAngle: null },
];

// ── HELPER ──
const parkGroup = (park) => {
  if (["Hollywood Studios", "Magic Kingdom", "EPCOT", "Animal Kingdom"].includes(park)) return "Walt Disney World";
  return park;
};

// ── ANIMATED NUMBER ──
function AnimNum({ target, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = target / (duration / 16);
          const animate = () => {
            start += step;
            if (start >= target) { setVal(target); return; }
            setVal(Math.floor(start));
            requestAnimationFrame(animate);
          };
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{typeof target === "number" && target % 1 !== 0 ? val.toFixed(1) : val.toLocaleString()}{suffix}</span>;
}

// ── CUSTOM TOOLTIP ──
const DarkTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(15,20,35,0.95)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: "0 0 4px" }}>{label || payload[0]?.payload?.name}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#aaa", fontSize: 12, margin: "2px 0" }}>
          {p.name}: <strong>{formatter ? formatter(p.value, p.name) : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── SECTION WRAPPER ──
function Section({ title, subtitle, children, span = false }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "28px 24px",
      gridColumn: span ? "1 / -1" : undefined,
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.3px" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "0 0 20px" }}>{subtitle}</p>}
      {!subtitle && <div style={{ height: 16 }} />}
      {children}
    </div>
  );
}

// ── RECORD PODIUM ──
const MEDAL_COLORS = {
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
};

const RecordPodium = ({ category, onSelectCoaster }) => {
  const { title, field, unit, icon, data } = category;
  if (!data || data.length === 0) return null;

  const [first, second, third] = data;

  const PodiumPlace = ({ coaster, place, height, medalColor }) => {
    if (!coaster) return <div style={{ width: 100 }} />;
    const parkColor = PARK_COLORS[coaster.park] || "#4ECDC4";
    return (
      <div
        onClick={() => onSelectCoaster && onSelectCoaster(coaster)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {/* Medal */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${medalColor} 0%, ${medalColor}88 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 900,
          color: place === 1 ? "#000" : "#fff",
          boxShadow: `0 4px 12px ${medalColor}44`,
          marginBottom: 8,
        }}>
          {place}
        </div>
        {/* Podium block */}
        <div style={{
          width: 100,
          height: height,
          background: `linear-gradient(180deg, ${medalColor}33 0%, ${medalColor}11 100%)`,
          border: `2px solid ${medalColor}55`,
          borderRadius: "8px 8px 0 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "12px 8px",
        }}>
          <div style={{
            fontSize: 20,
            fontWeight: 900,
            color: medalColor,
            letterSpacing: "-0.5px",
          }}>
            {coaster[field]?.toLocaleString()}{unit}
          </div>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            textAlign: "center",
            marginTop: 6,
            lineHeight: 1.2,
          }}>
            {coaster.name}
          </div>
          <div style={{
            fontSize: 9,
            color: parkColor,
            marginTop: 4,
            fontWeight: 600,
          }}>
            {coaster.park}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "20px 16px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
      }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{
          fontSize: 14,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}>
          {title}
        </span>
      </div>

      {/* Podium */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 8,
      }}>
        <PodiumPlace coaster={second} place={2} height={100} medalColor={MEDAL_COLORS.silver} />
        <PodiumPlace coaster={first} place={1} height={130} medalColor={MEDAL_COLORS.gold} />
        <PodiumPlace coaster={third} place={3} height={80} medalColor={MEDAL_COLORS.bronze} />
      </div>
    </div>
  );
};

// ── VIEW TOGGLE ──
const ViewToggle = ({ view, setView }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
    <button
      onClick={() => setView("table")}
      style={{
        padding: "8px 16px",
        background: view === "table" ? "#4ECDC4" : "rgba(255,255,255,0.1)",
        border: "none",
        borderRadius: 6,
        color: "#fff",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 12,
        transition: "all 0.2s",
      }}
    >
      Table View
    </button>
    <button
      onClick={() => setView("cards")}
      style={{
        padding: "8px 16px",
        background: view === "cards" ? "#4ECDC4" : "rgba(255,255,255,0.1)",
        border: "none",
        borderRadius: 6,
        color: "#fff",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 12,
        transition: "all 0.2s",
      }}
    >
      Card View
    </button>
  </div>
);

// ── DATA TABLE ──
const DataTable = ({ data }) => {
  const columns = Object.keys(data[0] || {});
  return (
    <div style={{ overflowX: "auto", borderRadius: 12 }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "rgba(255,255,255,0.03)",
        minWidth: 1200,
      }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} style={{
                padding: "12px 16px",
                textAlign: "left",
                background: "rgba(78,205,196,0.2)",
                color: "#4ECDC4",
                whiteSpace: "nowrap",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.3px",
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{
              background: i % 2 ? "rgba(255,255,255,0.02)" : "transparent"
            }}>
              {columns.map(col => (
                <td key={col} style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.8)",
                  maxWidth: 300,
                  whiteSpace: col.includes("Special") || col.includes("Records")
                    ? "normal" : "nowrap",
                  fontSize: 12,
                  lineHeight: 1.4,
                }}>
                  {row[col] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ── DATA CARDS ──
const DataCards = ({ data, onSelectCoaster }) => {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: 20,
    }}>
      {data.map((coaster, i) => {
        const parkColor = PARK_COLORS[coaster.Park] || "#4ECDC4";
        const hasImage = coaster["Image URL"];

        return (
          <div
            key={i}
            onClick={() => onSelectCoaster(coaster)}
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 12px 40px -10px ${parkColor}33`;
              e.currentTarget.style.borderColor = `${parkColor}44`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            {/* Hero Image or Gradient */}
            <div style={{
              height: 160,
              background: `linear-gradient(135deg, ${parkColor}33 0%, ${parkColor}11 100%)`,
              position: "relative",
              overflow: "hidden",
            }}>
              {hasImage && (
                <img
                  src={coaster["Image URL"]}
                  alt={coaster.Name}
                  referrerPolicy="no-referrer"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
              {/* Park Badge */}
              <div style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(4px)",
                padding: "6px 12px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                color: parkColor,
              }}>
                {coaster.Park}
              </div>
              {/* Year Badge */}
              {coaster["Year Opened"] && coaster["Year Opened"] !== "—" && (
                <div style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(4px)",
                  padding: "4px 10px",
                  borderRadius: 12,
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#FFD93D",
                }}>
                  {coaster["Year Opened"]}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: "16px 18px 20px" }}>
              <h3 style={{
                color: "#fff",
                fontSize: 17,
                fontWeight: 800,
                margin: "0 0 12px",
                letterSpacing: "-0.3px",
              }}>
                {coaster.Name}
              </h3>

              {/* Quick Stats */}
              <div style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
              }}>
                {coaster["Height (ft)"] && coaster["Height (ft)"] !== "—" && (
                  <div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: parkColor }}>
                      {coaster["Height (ft)"]}
                    </span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginLeft: 3 }}>ft</span>
                  </div>
                )}
                {coaster["Speed (mph)"] && coaster["Speed (mph)"] !== "—" && (
                  <div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: parkColor }}>
                      {coaster["Speed (mph)"]}
                    </span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginLeft: 3 }}>mph</span>
                  </div>
                )}
                {coaster["Inversions"] && coaster["Inversions"] !== "0" && coaster["Inversions"] !== "—" && (
                  <div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: parkColor }}>
                      {coaster["Inversions"]}
                    </span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginLeft: 3 }}>loops</span>
                  </div>
                )}
              </div>

              {/* View Details Hint */}
              <div style={{
                marginTop: 14,
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}>
                Click for details →
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── COASTER MODAL ──
const CoasterModal = ({ coaster, columns, onClose }) => {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    // Reset video state when coaster changes
    setShowVideo(false);
  }, [coaster?.Name]);

  if (!coaster) return null;

  const parkColor = PARK_COLORS[coaster.Park] || "#4ECDC4";
  const keyStats = ["Height (ft)", "Speed (mph)", "Drop (ft)", "Inversions", "Year Opened", "Max G-Force"];
  const excludeFromDetails = ["Name", "Park", "Image URL", ...keyStats];

  // Get POV video for this coaster
  const povVideo = POV_VIDEOS[coaster.Name];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg, #1a1f2e 0%, #0f1423 100%)",
          borderRadius: 20,
          maxWidth: 700,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          position: "relative",
        }}
      >
        {/* Hero Image */}
        <div style={{
          height: 250,
          background: `linear-gradient(135deg, ${parkColor}44 0%, ${parkColor}11 100%)`,
          borderRadius: "20px 20px 0 0",
          position: "relative",
          overflow: "hidden",
        }}>
          {coaster["Image URL"] && (
            <img
              src={coaster["Image URL"]}
              alt={coaster.Name}
              referrerPolicy="no-referrer"
                            onError={(e) => { e.target.style.display = 'none'; }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              border: "none",
              color: "#fff",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 28 }}>
          <h2 style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 4px",
            letterSpacing: "-0.5px",
          }}>
            {coaster.Name}
          </h2>
          <p style={{ color: parkColor, fontSize: 14, margin: "0 0 24px", fontWeight: 600 }}>
            {coaster.Park} · {coaster["Coaster Type"]}
          </p>

          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}>
            {keyStats.map(key => (
              coaster[key] && coaster[key] !== "—" && coaster[key] !== "0" && (
                <div key={key} style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 10,
                  padding: "12px 14px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#FFD93D" }}>
                    {coaster[key]}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {key.replace(/\s*\(.*\)/, '')}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* POV Video Section */}
          {povVideo && (
            <div style={{ marginBottom: 24 }}>
              {!showVideo ? (
                <button
                  onClick={() => setShowVideo(true)}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 15px rgba(255,0,0,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,0,0,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(255,0,0,0.3)";
                  }}
                >
                  <span style={{ fontSize: 18 }}>▶</span>
                  🎬 Watch Front-Seat POV Video
                </button>
              ) : (
                <div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                      🎬 Front-Seat POV
                    </span>
                    <button
                      onClick={() => setShowVideo(false)}
                      style={{
                        padding: "6px 12px",
                        background: "rgba(255,255,255,0.1)",
                        border: "none",
                        borderRadius: 6,
                        color: "rgba(255,255,255,0.7)",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      ✕ Close Video
                    </button>
                  </div>
                  <div style={{
                    position: "relative",
                    paddingTop: "56.25%",
                    background: "#000",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${povVideo.id}?autoplay=1&rel=0`}
                      title={povVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Details */}
          <div style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.7)" }}>
            {columns.filter(c => !excludeFromDetails.includes(c)).map(col => (
              coaster[col] && coaster[col] !== "—" && (
                <div key={col} style={{ marginBottom: 12 }}>
                  <span style={{ color: parkColor, fontWeight: 600 }}>{col}:</span>{" "}
                  <span style={{ color: "rgba(255,255,255,0.85)" }}>{coaster[col]}</span>
                </div>
              )
            ))}
          </div>

          {/* Times Ridden */}
          {coaster["Times Ridden"] && coaster["Times Ridden"] !== "—" && (
            <div style={{
              marginTop: 20,
              padding: "12px 16px",
              background: `${parkColor}15`,
              border: `1px solid ${parkColor}33`,
              borderRadius: 10,
              fontSize: 13,
              color: parkColor,
              fontWeight: 600,
            }}>
              Reed has ridden this {coaster["Times Ridden"]} time{coaster["Times Ridden"] !== "1" ? "s" : ""}
              {coaster["Reed's Age on 1st Ride"] && coaster["Reed's Age on 1st Ride"] !== "—" && (
                <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
                  {" "}· First rode at age {coaster["Reed's Age on 1st Ride"]}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ──
export default function CoasterViz() {
  const [activeTab, setActiveTab] = useState("overview");
  const [rawDataView, setRawDataView] = useState("cards");
  const [selectedCoaster, setSelectedCoaster] = useState(null);

  // ── DERIVED DATA ──
  const heightData = coasters.filter(c => c.height).sort((a, b) => b.height - a.height).map(c => ({
    name: c.name.length > 18 ? c.name.slice(0, 16) + "…" : c.name,
    fullName: c.name,
    height: c.height,
    fill: PARK_COLORS[c.park],
    park: c.park,
  }));

  const speedData = coasters.filter(c => c.speed).sort((a, b) => b.speed - a.speed).map(c => ({
    name: c.name.length > 18 ? c.name.slice(0, 16) + "…" : c.name,
    fullName: c.name,
    speed: c.speed,
    fill: PARK_COLORS[c.park],
    park: c.park,
  }));

  const scatterData = coasters.filter(c => c.height && c.speed).map(c => ({
    name: c.name,
    x: c.height,
    y: c.speed,
    z: (c.track || 2000) / 400,
    fill: PARK_COLORS[c.park],
    park: c.park,
    track: c.track,
  }));

  const inversionData = coasters.filter(c => c.inversions > 0).sort((a, b) => b.inversions - a.inversions).map(c => ({
    name: c.name,
    inversions: c.inversions,
    fill: PARK_COLORS[c.park],
    park: c.park,
  }));

  const parkCounts = {};
  coasters.forEach(c => {
    const g = parkGroup(c.park);
    parkCounts[g] = (parkCounts[g] || 0) + 1;
  });
  const parkPieData = Object.entries(parkCounts).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({
    name, value, fill: PARK_GROUPS[name],
  }));

  const mfrCounts = {};
  coasters.forEach(c => { mfrCounts[c.mfr] = (mfrCounts[c.mfr] || 0) + 1; });
  const mfrPieData = Object.entries(mfrCounts).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({
    name, value, fill: MFR_COLORS[name],
  }));

  const timelineData = coasters.filter(c => c.year).sort((a, b) => a.year - b.year).map(c => ({
    name: c.name,
    year: c.year,
    height: c.height || 50,
    speed: c.speed || 30,
    fill: PARK_COLORS[c.park],
    park: c.park,
  }));

  const decadeCounts = {};
  coasters.filter(c => c.year).forEach(c => {
    const decade = Math.floor(c.year / 10) * 10 + "s";
    decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
  });
  const decadeData = Object.entries(decadeCounts).sort((a, b) => a[0].localeCompare(b[0])).map(([name, count]) => ({ name, count }));

  const trackData = coasters.filter(c => c.track).sort((a, b) => b.track - a.track).map(c => ({
    name: c.name.length > 18 ? c.name.slice(0, 16) + "…" : c.name,
    fullName: c.name,
    track: c.track,
    fill: PARK_COLORS[c.park],
    park: c.park,
  }));

  const gforceData = coasters.filter(c => c.gforce).sort((a, b) => b.gforce - a.gforce).map(c => ({
    name: c.name,
    gforce: c.gforce,
    fill: PARK_COLORS[c.park],
  }));

  const totalTrack = coasters.reduce((s, c) => s + (c.track || 0), 0);
  const totalInversions = coasters.reduce((s, c) => s + c.inversions, 0);
  const avgSpeed = Math.round(coasters.filter(c => c.speed).reduce((s, c) => s + c.speed, 0) / coasters.filter(c => c.speed).length);
  const maxGforce = Math.max(...coasters.filter(c => c.gforce).map(c => c.gforce));

  // ── RECORDS DATA ── (top 3 for each category)
  const getTop3 = (arr, field, ascending = false) => {
    const filtered = arr.filter(c => c[field] != null);
    const sorted = ascending
      ? filtered.sort((a, b) => a[field] - b[field])
      : filtered.sort((a, b) => b[field] - a[field]);
    return sorted.slice(0, 3);
  };

  const recordCategories = [
    { id: "tallest", title: "Tallest", field: "height", unit: "ft", icon: "🏔️", data: getTop3(coasters, "height") },
    { id: "fastest", title: "Fastest", field: "speed", unit: "mph", icon: "⚡", data: getTop3(coasters, "speed") },
    { id: "longest", title: "Longest Track", field: "track", unit: "ft", icon: "📏", data: getTop3(coasters, "track") },
    { id: "inversions", title: "Most Inversions", field: "inversions", unit: "", icon: "🔄", data: getTop3(coasters, "inversions") },
    { id: "gforce", title: "Highest G-Force", field: "gforce", unit: "G", icon: "💥", data: getTop3(coasters, "gforce") },
    { id: "steepest", title: "Steepest Drop", field: "dropAngle", unit: "°", icon: "🎯", data: getTop3(coasters, "dropAngle") },
    { id: "oldest", title: "Oldest", field: "year", unit: "", icon: "📜", data: getTop3(coasters, "year", true) },
    { id: "newest", title: "Newest", field: "year", unit: "", icon: "✨", data: getTop3(coasters, "year", false) },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "height-speed", label: "Height & Speed" },
    { id: "inversions", label: "Inversions & G's" },
    { id: "tracks", label: "Tracks & Time" },
    { id: "builders", label: "Builders & Types" },
    { id: "records", label: "Records" },
    { id: "raw-data", label: "Raw Data" },
  ];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="rgba(255,255,255,0.7)" textAnchor={x > cx ? "start" : "end"} fontSize={11} fontWeight={600}>
        {name} ({value})
      </text>
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #0a0e1a 0%, #111827 40%, #0f172a 100%)",
      color: "#fff",
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      padding: "0 0 40px",
    }}>
      {/* HERO */}
      <div style={{
        padding: "48px 24px 32px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(78,205,196,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(255,107,107,0.08) 0%, transparent 50%)",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, color: "rgba(255,255,255,0.35)", marginBottom: 8, textTransform: "uppercase" }}>
            Data Visualization
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 900,
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
            margin: "0 0 8px",
            background: "linear-gradient(135deg, #4ECDC4 0%, #FFD93D 35%, #FF6B6B 65%, #4D96FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Reed's Roller Coaster Universe
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 500, margin: "0 auto 32px" }}>
            29 coasters. 9 parks. 50+ years of engineering. Every twist, drop, and loop — visualized.
          </p>

          {/* HERO STATS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 12,
            maxWidth: 700,
            margin: "0 auto",
          }}>
            {[
              { val: 29, label: "Coasters", suffix: "", color: "#4ECDC4" },
              { val: 325, label: "Max Height", suffix: " ft", color: "#FFD93D" },
              { val: 95, label: "Top Speed", suffix: " mph", color: "#FF6B6B" },
              { val: 44, label: "Inversions", suffix: "", color: "#4D96FF" },
              { val: 5.0, label: "Peak G-Force", suffix: " G", color: "#C084FC" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "16px 8px 12px",
              }}>
                <div style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 900, color: s.color, letterSpacing: "-1px" }}>
                  <AnimNum target={s.val} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TAB NAV */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 4,
        padding: "0 16px 24px",
        flexWrap: "wrap",
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "8px 18px",
              borderRadius: 24,
              border: "1px solid",
              borderColor: activeTab === t.id ? "rgba(78,205,196,0.5)" : "rgba(255,255,255,0.1)",
              background: activeTab === t.id ? "rgba(78,205,196,0.15)" : "transparent",
              color: activeTab === t.id ? "#4ECDC4" : "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.3px",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* PARK LEGEND */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", padding: "0 16px 24px" }}>
        {Object.entries(PARK_GROUPS).map(([name, color]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{name}</span>
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 16px" }}>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <Section title="🏔️ The Skyline" subtitle="Every coaster Reed has ridden, ranked by height" span>
              <div style={{ width: "100%", overflowX: "auto" }}>
                <div style={{ minWidth: 700, height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={heightData} margin={{ top: 5, right: 10, bottom: 60, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9, fontWeight: 600 }} angle={-45} textAnchor="end" interval={0} height={70} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} unit=" ft" />
                      <Tooltip content={<DarkTooltip formatter={(v) => v + " ft"} />} />
                      <Bar dataKey="height" radius={[4, 4, 0, 0]} animationDuration={1500}>
                        {heightData.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Section>

            <Section title="🎡 Coasters by Park" subtitle="Where Reed has ridden">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={parkPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" stroke="rgba(0,0,0,0.3)" strokeWidth={2} label={renderCustomLabel} labelLine={{ stroke: "rgba(255,255,255,0.2)" }}>
                    {parkPieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Section>

            <Section title="🏭 Manufacturer DNA" subtitle="Who built Reed's rides?">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={mfrPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" stroke="rgba(0,0,0,0.3)" strokeWidth={2} label={renderCustomLabel} labelLine={{ stroke: "rgba(255,255,255,0.2)" }}>
                    {mfrPieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Section>

            <Section title="📅 Coasters by Decade" subtitle="50+ years of coaster engineering" span>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={decadeData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<DarkTooltip formatter={(v) => v + " coasters"} />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={1200}>
                    {decadeData.map((d, i) => <Cell key={i} fill={["#4ECDC4", "#FFD93D", "#6BCB77", "#FF6B6B", "#4D96FF", "#C084FC"][i % 6]} fillOpacity={0.8} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>
          </div>
        )}

        {/* ── HEIGHT & SPEED ── */}
        {activeTab === "height-speed" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            <Section title="⚡ Height vs Speed" subtitle="Does taller always mean faster? Bubble size = track length">
              <ResponsiveContainer width="100%" height={380}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" dataKey="x" name="Height" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} unit=" ft" label={{ value: "Height (ft)", position: "bottom", offset: 0, fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                  <YAxis type="number" dataKey="y" name="Speed" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} unit=" mph" label={{ value: "Speed (mph)", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ background: "rgba(15,20,35,0.95)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                        <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: "0 0 4px" }}>{d.name}</p>
                        <p style={{ color: d.fill, fontSize: 12, margin: "2px 0" }}>{d.park}</p>
                        <p style={{ color: "#aaa", fontSize: 11, margin: "2px 0" }}>Height: {d.x} ft · Speed: {d.y} mph</p>
                        {d.track && <p style={{ color: "#aaa", fontSize: 11, margin: "2px 0" }}>Track: {d.track.toLocaleString()} ft</p>}
                      </div>
                    );
                  }} />
                  <Scatter data={scatterData} animationDuration={1200}>
                    {scatterData.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.7} r={Math.max(d.z, 4)} />)}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </Section>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              <Section title="🏎️ Speed Rankings" subtitle="Top speed in mph">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={speedData.slice(0, 15)} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} unit=" mph" />
                    <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 600 }} width={130} />
                    <Tooltip content={<DarkTooltip formatter={(v) => v + " mph"} />} />
                    <Bar dataKey="speed" radius={[0, 4, 4, 0]} animationDuration={1200} barSize={16}>
                      {speedData.slice(0, 15).map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Section>

              <Section title="🎯 Drop Angles" subtitle="The steeper the scarier — 90° is straight down, 91° is beyond vertical!">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {coasters.filter(c => c.dropAngle).sort((a, b) => b.dropAngle - a.dropAngle).map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ minWidth: 130, fontSize: 12, fontWeight: 700, color: PARK_COLORS[c.park] }}>{c.name}</div>
                      <div style={{ flex: 1, height: 20, background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", position: "relative" }}>
                        <div style={{
                          height: "100%",
                          width: `${(c.dropAngle / 91) * 100}%`,
                          background: `linear-gradient(90deg, ${PARK_COLORS[c.park]}88, ${PARK_COLORS[c.park]})`,
                          borderRadius: 10,
                          transition: "width 1.5s ease",
                        }} />
                      </div>
                      <div style={{ minWidth: 36, fontSize: 13, fontWeight: 800, color: c.dropAngle >= 90 ? "#FF4081" : "#fff" }}>
                        {c.dropAngle}°
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </div>
        )}

        {/* ── INVERSIONS & G-FORCES ── */}
        {activeTab === "inversions" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <Section title="🔄 Inversion Kings" subtitle="Coasters that flip you upside down" span>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={inversionData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 600 }} angle={-20} textAnchor="end" />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<DarkTooltip formatter={(v) => v + " inversions"} />} />
                  <Bar dataKey="inversions" radius={[6, 6, 0, 0]} animationDuration={1200} barSize={40}>
                    {inversionData.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>

            <Section title="💥 G-Force Meter" subtitle="How hard these rides push you into your seat">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {gforceData.map((c, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: c.fill }}>{c.name}</span>
                      <span style={{ fontSize: 14, fontWeight: 900, color: c.gforce >= 4.5 ? "#FF4081" : "#fff" }}>{c.gforce} G</span>
                    </div>
                    <div style={{ height: 24, background: "rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", position: "relative" }}>
                      <div style={{
                        height: "100%",
                        width: `${(c.gforce / 5.5) * 100}%`,
                        background: c.gforce >= 4.5
                          ? "linear-gradient(90deg, #FF6B6B, #FF4081)"
                          : `linear-gradient(90deg, ${c.fill}66, ${c.fill})`,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingRight: 8,
                      }}>
                        {c.gforce >= 4.5 && <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>EXTREME</span>}
                      </div>
                      {/* Reference lines */}
                      <div style={{ position: "absolute", left: `${(1 / 5.5) * 100}%`, top: 0, bottom: 0, borderLeft: "1px dashed rgba(255,255,255,0.15)" }} />
                      <div style={{ position: "absolute", left: `${(2 / 5.5) * 100}%`, top: 0, bottom: 0, borderLeft: "1px dashed rgba(255,255,255,0.15)" }} />
                      <div style={{ position: "absolute", left: `${(3 / 5.5) * 100}%`, top: 0, bottom: 0, borderLeft: "1px dashed rgba(255,255,255,0.15)" }} />
                      <div style={{ position: "absolute", left: `${(4 / 5.5) * 100}%`, top: 0, bottom: 0, borderLeft: "1px dashed rgba(255,255,255,0.15)" }} />
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, padding: "0 2px" }}>
                  {[0, 1, 2, 3, 4, 5].map(n => (
                    <span key={n} style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>{n}G</span>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic", margin: "4px 0 0" }}>
                  For reference: 1G = normal gravity · Fighter pilot turns ≈ 9G · Space shuttle launch ≈ 3G
                </p>
              </div>
            </Section>

            <Section title="🧮 Inversion Breakdown" subtitle="Where all 44 inversions come from">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {inversionData.map((c, i) => {
                  const pct = (c.inversions / 44) * 100;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ minWidth: 110, fontSize: 11, fontWeight: 700, color: c.fill }}>{c.name}</div>
                      <div style={{ flex: 1, display: "flex", gap: 3 }}>
                        {Array.from({ length: c.inversions }).map((_, j) => (
                          <div key={j} style={{
                            width: 22, height: 22, borderRadius: "50%",
                            background: c.fill,
                            opacity: 0.8,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 800, color: "#000",
                          }}>
                            {j + 1}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, minWidth: 28, textAlign: "right" }}>
                        {pct.toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
        )}

        {/* ── TRACKS & TIME ── */}
        {activeTab === "tracks" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            {/* Big stat */}
            <div style={{
              textAlign: "center",
              padding: "24px 16px",
              background: "rgba(78,205,196,0.06)",
              border: "1px solid rgba(78,205,196,0.15)",
              borderRadius: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
                Total Track Length Ridden
              </div>
              <div style={{ fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 900, color: "#4ECDC4", letterSpacing: "-2px" }}>
                <AnimNum target={totalTrack} suffix=" ft" />
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                That's <strong style={{ color: "#FFD93D" }}>{(totalTrack / 5280).toFixed(1)} miles</strong> — about {(totalTrack / 5280 / 24 * 60).toFixed(0)} minutes of driving at highway speed
              </div>
            </div>

            <Section title="📏 Track Length Rankings" subtitle="Feet of track per coaster" span>
              <div style={{ width: "100%", overflowX: "auto" }}>
                <div style={{ minWidth: 700, height: 340 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trackData} margin={{ top: 5, right: 10, bottom: 60, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9, fontWeight: 600 }} angle={-45} textAnchor="end" interval={0} height={70} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div style={{ background: "rgba(15,20,35,0.95)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "10px 14px" }}>
                            <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: "0 0 4px" }}>{d.fullName}</p>
                            <p style={{ color: d.fill, fontSize: 12 }}>{d.track.toLocaleString()} ft ({(d.track / 5280).toFixed(2)} mi)</p>
                          </div>
                        );
                      }} />
                      <Bar dataKey="track" radius={[4, 4, 0, 0]} animationDuration={1500}>
                        {trackData.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Section>

            <Section title="⏳ Timeline: When These Rides Were Born" subtitle="Coasters sorted by year opened" span>
              <div style={{ width: "100%", overflowX: "auto" }}>
                <div style={{ minWidth: 700, height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timelineData} margin={{ top: 10, right: 20, bottom: 50, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                      <YAxis yAxisId="h" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: "Height (ft)", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.25)", fontSize: 10 }} />
                      <YAxis yAxisId="s" orientation="right" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: "Speed (mph)", angle: 90, position: "insideRight", fill: "rgba(255,255,255,0.25)", fontSize: 10 }} />
                      <Tooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0]?.payload;
                        return (
                          <div style={{ background: "rgba(15,20,35,0.95)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "10px 14px" }}>
                            <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: "0 0 4px" }}>{d.name} ({d.year})</p>
                            <p style={{ color: d.fill, fontSize: 12 }}>{d.park}</p>
                            <p style={{ color: "#aaa", fontSize: 11 }}>Height: {d.height} ft · Speed: {d.speed} mph</p>
                          </div>
                        );
                      }} />
                      <Bar yAxisId="h" dataKey="height" radius={[3, 3, 0, 0]} barSize={14} fillOpacity={0.5} animationDuration={1200}>
                        {timelineData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                      </Bar>
                      <Line yAxisId="s" type="monotone" dataKey="speed" stroke="#FF6B6B" strokeWidth={2} dot={{ r: 4, fill: "#FF6B6B", stroke: "#0a0e1a", strokeWidth: 2 }} animationDuration={1500} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* ── BUILDERS & TYPES ── */}
        {activeTab === "builders" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <Section title="🏭 Manufacturer Breakdown" subtitle="B&M dominates Reed's list" span>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {mfrPieData.map((m, i) => {
                  const pct = (m.value / 29) * 100;
                  const mfrCoasters = coasters.filter(c => c.mfr === m.name).map(c => c.name);
                  return (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: m.fill }}>{m.name}</span>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{m.value} coasters ({pct.toFixed(0)}%)</span>
                      </div>
                      <div style={{ height: 20, background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${m.fill}88, ${m.fill})`,
                          borderRadius: 10,
                          transition: "width 1s ease",
                        }} />
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 3, lineHeight: 1.4 }}>
                        {mfrCoasters.join(" · ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="🎠 Coaster Types" subtitle="The variety of ride experiences">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(() => {
                  const types = {};
                  coasters.forEach(c => { types[c.type] = (types[c.type] || 0) + 1; });
                  return Object.entries(types).sort((a, b) => b[1] - a[1]).map(([type, count], i) => {
                    const colors = ["#4ECDC4", "#FFD93D", "#FF6B6B", "#4D96FF", "#6BCB77", "#C084FC", "#FF9A3C", "#00BFA5", "#FF4081", "#8E99A4"];
                    return (
                      <div key={i} style={{
                        padding: "8px 14px",
                        borderRadius: 20,
                        background: `${colors[i % colors.length]}15`,
                        border: `1px solid ${colors[i % colors.length]}33`,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}>
                        <span style={{ fontSize: 16, fontWeight: 900, color: colors[i % colors.length] }}>{count}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{type}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </Section>

            <Section title="🗺️ Geography" subtitle="Reed's coasters by state">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { state: "Florida", count: 17, color: "#FF6B6B", parks: "Busch Gardens Tampa (7), SeaWorld Orlando (3), Walt Disney World (7)" },
                  { state: "Ohio", count: 6, color: "#4ECDC4", parks: "Kings Island (6)" },
                  { state: "North Carolina", count: 6, color: "#6BCB77", parks: "Carowinds (5), Jellystone Park (1)" },
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: "14px 18px",
                    background: `${s.color}08`,
                    border: `1px solid ${s.color}22`,
                    borderRadius: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.state}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.parks}</div>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: s.color, opacity: 0.8 }}>{s.count}</div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ── RECORDS ── */}
        {activeTab === "records" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Hero Header */}
            <div style={{
              textAlign: "center",
              padding: "24px 16px",
              background: "linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(192,192,192,0.05) 50%, rgba(205,127,50,0.08) 100%)",
              border: "1px solid rgba(255,215,0,0.15)",
              borderRadius: 16,
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
              <h2 style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#FFD700",
                margin: "0 0 8px",
                letterSpacing: "-0.5px",
              }}>
                Hall of Records
              </h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                The ultimate champions of Reed's coaster collection
              </p>
            </div>

            {/* Podium Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 16,
            }}>
              {recordCategories.map((cat) => (
                <RecordPodium
                  key={cat.id}
                  category={cat}
                  onSelectCoaster={(coaster) => {
                    // Find the full coaster data from rawCoasterData for the modal
                    const fullCoaster = rawCoasterData.find(c => c.Name === coaster.name);
                    if (fullCoaster) setSelectedCoaster(fullCoaster);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── RAW DATA ── */}
        {activeTab === "raw-data" && (
          <Section title="📊 Raw Coaster Data" subtitle={`Complete database of ${rawCoasterData.length} roller coasters with all stats and details`} span>
            <ViewToggle view={rawDataView} setView={setRawDataView} />
            {rawDataView === "table" ? (
              <DataTable data={rawCoasterData} />
            ) : (
              <DataCards data={rawCoasterData} onSelectCoaster={setSelectedCoaster} />
            )}
          </Section>
        )}

        {/* FOOTER */}
        <div style={{ textAlign: "center", padding: "40px 16px 0", color: "rgba(255,255,255,0.2)", fontSize: 11 }}>
          <div style={{ width: 60, height: 1, background: "rgba(255,255,255,0.1)", margin: "0 auto 16px" }} />
          Reed's Roller Coaster Database · 29 Coasters · 9 Parks · Data compiled 2026
        </div>
      </div>

      {/* COASTER DETAIL MODAL */}
      {selectedCoaster && (
        <CoasterModal
          coaster={selectedCoaster}
          columns={Object.keys(rawCoasterData[0] || {})}
          onClose={() => setSelectedCoaster(null)}
        />
      )}
    </div>
  );
}
