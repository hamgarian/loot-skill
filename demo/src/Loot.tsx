import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const GOLD = '#F2B705';
const RARITY = { COMMON: '#9DA5B4', RARE: '#4C9AFF', EPIC: '#B474FF', LEGENDARY: GOLD } as const;
type Rarity = keyof typeof RARITY;

// The drops loot found when it was run on the session that built it.
const DROPS: { rarity: Rarity; name: string; what: string; forms: string }[] = [
  { rarity: 'EPIC', name: 'loot-skill', what: 'ships what sessions find', forms: 'repo, post, demo' },
  { rarity: 'RARE', name: 'scan.mjs', what: 'zero-dependency secret scanner', forms: 'bundled in repo' },
  { rarity: 'RARE', name: 'naming a dev tool', what: 'hatch → sidequest → loot', forms: 'post section' },
  { rarity: 'COMMON', name: 'preview server', what: '10-line static server', forms: 'LOOT.md' },
];
const SHIPPED = ['repo   github.com/hamgarian/loot-skill', 'post   posts/loot.md', 'demo   assets/demo.gif'];

const mono: CSSProperties = { fontFamily: 'Consolas, "JetBrains Mono", Menlo, monospace', fontSize: 20, lineHeight: 1.55 };

const fadeIn = (frame: number, at: number) =>
  interpolate(frame, [at, at + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const Typed = ({ text, at, frame }: { text: string; at: number; frame: number }) => {
  const shown = Math.max(0, Math.min(text.length, Math.floor((frame - at) / 2)));
  const typing = frame >= at && shown < text.length;
  return (
    <span>
      {text.slice(0, shown)}
      {typing && <span style={{ background: '#e6edf3', color: '#0d1117' }}> </span>}
    </span>
  );
};

const Line = ({ at, frame, children }: { at: number; frame: number; children: ReactNode }) => (
  <div style={{ opacity: fadeIn(frame, at), transform: `translateY(${(1 - fadeIn(frame, at)) * 6}px)` }}>{children}</div>
);

const Chest = ({ size }: { size: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <mask id="kh">
      <rect width="64" height="64" fill="#fff" />
      <path d="M32 26.5a2.5 2.5 0 0 0-1.25 4.67V34h2.5v-2.83A2.5 2.5 0 0 0 32 26.5z" fill="#000" />
    </mask>
    <g fill={GOLD} mask="url(#kh)">
      <path d="M8 27v-3c0-6.6 5.4-12 12-12h24c6.6 0 12 5.4 12 12v3z" />
      <path d="M8 30h48v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" />
      <rect x="25" y="22" width="14" height="16" rx="2.5" />
      <path d="M55 1l1.5 4.5L61 7l-4.5 1.5L55 13l-1.5-4.5L49 7l4.5-1.5z" />
    </g>
  </svg>
);

export const Loot = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ROWS = 92;
  const ASK = ROWS + DROPS.length * 22 + 10;
  const SHIP = ASK + 40;
  const END = 360;

  const termOut = interpolate(frame, [END, END + 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const card = spring({ frame: frame - END - 6, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 30%, #1b2230, #0b0e14)', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          ...mono,
          opacity: termOut,
          width: 860,
          height: 440,
          background: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: 12,
          color: '#e6edf3',
          boxShadow: '0 20px 60px rgba(0,0,0,.5)',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '1px solid #21262d' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />
          ))}
        </div>
        <div style={{ padding: '14px 22px' }}>
          <div>
            <span style={{ color: GOLD }}>&gt; </span>
            <Typed text="/loot" at={10} frame={frame} />
          </div>
          <Line at={40} frame={frame}>
            <span style={{ color: '#7d8590' }}>scanning session… checking what already exists…</span>
          </Line>
          <Line at={70} frame={frame}>
            <b>LOOT: {DROPS.length} drops</b>
          </Line>
          {DROPS.map((d, i) => {
            const at = ROWS + i * 22;
            const pop = spring({ frame: frame - at, fps, config: { damping: 12 } });
            return (
              <div key={d.name} style={{ opacity: fadeIn(frame, at), whiteSpace: 'nowrap' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 140,
                    color: RARITY[d.rarity],
                    transform: `scale(${0.6 + 0.4 * pop})`,
                    transformOrigin: 'left center',
                    textShadow: d.rarity === 'COMMON' ? 'none' : `0 0 12px ${RARITY[d.rarity]}88`,
                  }}
                >
                  [{d.rarity}]
                </span>
                <b>{d.name}</b> <span style={{ color: '#7d8590' }}>{d.what}</span>
                <span style={{ color: '#7d8590' }}> → </span>
                {d.forms}
              </div>
            );
          })}
          <div style={{ marginTop: 8, opacity: fadeIn(frame, ASK) }}>
            Ship which? <span style={{ color: GOLD }}>&gt; </span>
            <Typed text="1" at={ASK + 10} frame={frame} />
          </div>
          {SHIPPED.map((s, i) => (
            <Line key={s} at={SHIP + i * 16} frame={frame}>
              <span style={{ color: '#3fb950' }}>✓ </span>
              {s}
            </Line>
          ))}
        </div>
      </div>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: card, transform: `scale(${0.9 + 0.1 * card})` }}>
        <Chest size={120} />
        <div style={{ ...mono, fontSize: 64, fontWeight: 700, color: '#e6edf3', marginTop: 8 }}>loot</div>
        <div style={{ ...mono, fontSize: 24, color: '#9DA5B4', marginTop: 4 }}>
          Every AI session drops loot. <span style={{ color: GOLD }}>/loot</span> ships it.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
