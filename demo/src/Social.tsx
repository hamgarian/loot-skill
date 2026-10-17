import { AbsoluteFill } from 'remotion';
import { Chest, GOLD, RARITY } from './Loot';

// GitHub social preview: 1280×640, centered so crops on other sites keep the essentials.
const mono = { fontFamily: 'Consolas, "JetBrains Mono", Menlo, monospace' };

export const Social = () => (
  <AbsoluteFill style={{ ...mono, background: 'radial-gradient(circle at 50% 40%, #1b2230, #0b0e14)', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <Chest size={150} />
      <div style={{ fontSize: 140, fontWeight: 700, color: '#e6edf3', letterSpacing: -4 }}>loot</div>
    </div>
    <div style={{ fontSize: 36, color: '#9DA5B4', marginTop: 24 }}>
      Every AI session drops loot. <span style={{ color: GOLD }}>/loot</span> ships it.
    </div>
    <div style={{ display: 'flex', gap: 18, marginTop: 44, fontSize: 26 }}>
      {(Object.keys(RARITY) as (keyof typeof RARITY)[]).reverse().map((r) => (
        <div key={r} style={{ color: RARITY[r], border: `2px solid ${RARITY[r]}66`, borderRadius: 10, padding: '6px 18px' }}>
          {r}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
