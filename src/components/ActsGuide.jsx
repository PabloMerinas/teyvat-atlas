import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import clsx from 'clsx';
import { LoreIcon } from './icons.jsx';
import { ACTS, REGIONS, CANON, spoilerIndex } from '../data/lore.js';

export default function ActsGuide({ onClose, spoilerLimit }) {
  const [activeId, setActiveId] = useState(ACTS[0].id);
  const active = ACTS.find((c) => c.id === activeId) ?? ACTS[0];
  const limitIdx = spoilerIndex(spoilerLimit);
  const activeLocked = spoilerIndex(active.spoiler) > limitIdx;

  return (
    <div className="acts-guide">
      <div className="acts-guide-panel">
        <header className="acts-guide-head">
          <div>
            <span className="acts-guide-kicker">Cuesta del Arconte</span>
            <h2 className="acts-guide-title">Guía por actos</h2>
          </div>
          <button className="panel-close" onClick={onClose} aria-label="Cerrar guía por actos">
            <X size={16} />
          </button>
        </header>

        <div className="acts-guide-body">
          <nav className="acts-guide-nav">
            {ACTS.map((c) => {
              const locked = spoilerIndex(c.spoiler) > limitIdx;
              return (
                <button
                  key={c.id}
                  className={clsx('acts-guide-nav-item', { active: c.id === activeId })}
                  style={{ '--c': REGIONS[c.region]?.color }}
                  onClick={() => setActiveId(c.id)}
                >
                  <span className="acts-guide-nav-glyph">
                    {locked ? <Lock size={15} /> : <LoreIcon name={c.icon} size={15} />}
                  </span>
                  <span>
                    <span className="acts-guide-nav-title">{c.title}</span>
                    <span className="acts-guide-nav-sub">{c.subtitle}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="acts-guide-content" style={{ '--c': REGIONS[active.region]?.color }}>
            {activeLocked ? (
              <div className="panel-locked">
                <Lock size={28} />
                <h2>Contenido oculto</h2>
                <p>
                  Este capítulo contiene spoilers de <strong>{REGIONS[active.spoiler]?.label ?? active.spoiler}</strong> en
                  adelante. Sube tu progreso en el selector de la barra superior para revelarlo.
                </p>
              </div>
            ) : (
              <>
                <header className="acts-guide-content-head">
                  <span className="acts-guide-content-kicker">{active.title}</span>
                  <h3 className="acts-guide-content-title">{active.subtitle}</h3>
                  <p className="acts-guide-content-tagline">{active.tagline}</p>
                </header>

                <ol className="acts-list">
                  {active.acts.map((a, i) => (
                    <li key={i} className="act-card">
                      <span className="act-card-title">{a.title}</span>
                      <p className="act-card-body">{a.body}</p>
                      <span className="chip chip-canon" style={{ '--chip': CANON[a.canon].color }}>
                        {CANON[a.canon].label}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
