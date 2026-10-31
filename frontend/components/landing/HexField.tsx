"use client";

import { useState } from 'react';
const views = {
  all: { title: 'Every voice belongs to a bigger picture.', text: 'Explore the clusters to see where customer experiences connect.' },
  friction: { title: 'Find the friction. Follow the pattern.', text: 'Shared frustrations become visible when you look at feedback together.' },
  delight: { title: 'See what’s working. Build on it.', text: 'Discover the experiences customers keep coming back for.' },
};
type View = keyof typeof views;
export function HexField() {
  const [view, setView] = useState<View>('all');
  return <div className="hex-experience">
    <div className="hex-field"><svg viewBox="0 0 900 800" role="img" aria-label="Illustrative honeycomb sentiment map with plum friction clusters and orange delight clusters">
      {Array.from({length: 31 * 29}, (_, i) => {
        const col = i % 31, row = Math.floor(i / 31);
        const x = 18 + col * 29 + (row % 2) * 14.5, y = 20 + row * 25;
        const ridge = 15 + 5 * Math.sin(col / 6);
        const distance = Math.abs(row - ridge);
        const occupied = distance < 6.5 && col > 1 && col < 30;
        const scattered = !occupied && (i * 17 % 31 < 3) && distance < 11;
        if (!occupied && !scattered) return null;
        const delight = col > 19 && row < ridge + 3;
        const friction = col < 13;
        const center = occupied;
        const fill = delight ? ['#ff5a0a','#ff7837','#ff965c'][i%3] : friction ? ['#b875c6','#d9a5e2','#8a459e'][i%3] : ['#e9c7ee','#c78ed4','#f2d9f3'][i%3];
        const active = view === 'all' || (view === 'friction' ? friction : delight);
        return <polygon key={i} points={`${x},${y-14} ${x+12},${y-7} ${x+12},${y+7} ${x},${y+14} ${x-12},${y+7} ${x-12},${y-7}`} fill={fill} opacity={active ? (center || friction || delight ? 1 : .5) : .13} />;
      })}
    </svg><div className="map-label label-delight"><i/> “This is exactly what I needed.”</div><div className="map-label label-friction"><i/> “Why is this still so difficult?”</div><div className="map-coordinate">Many voices. Connected patterns.</div></div>
    <div className="hex-controls" aria-label="Explore example sentiment clusters">{(['all','friction','delight'] as View[]).map(key=><button key={key} type="button" aria-pressed={view===key} onClick={()=>setView(key)}>{key==='all'?'The whole picture':key==='friction'?'Find friction':'See delight'}</button>)}</div>
    <div className="hex-caption" aria-live="polite"><strong>{views[view].title}</strong><p>{views[view].text}</p><small>Illustrative sentiment map</small></div>
  </div>;
}
