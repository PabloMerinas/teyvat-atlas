import { useState } from 'react';
import { BookMarked, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { ERAS, TYPES } from '../data/lore.js';

const TYPE_SHAPES = {
  evento: 'shape-evento',
  personaje: 'shape-personaje',
  faccion: 'shape-faccion',
  objeto: 'shape-objeto',
  misterio: 'shape-misterio',
};

const LINE_KINDS = [
  { kind: 'causa', label: 'Causa / consecuencia' },
  { kind: 'vinculo', label: 'Vínculo' },
  { kind: 'conflicto', label: 'Conflicto' },
  { kind: 'misterio', label: 'Misterio abierto' },
  { kind: 'origen', label: 'Origen' },
];

export default function Legend() {
  const [open, setOpen] = useState(false);

  return (
    <div className={clsx('legend', { open })}>
      <button className="legend-toggle" onClick={() => setOpen(!open)}>
        {open ? <ChevronUp size={14} /> : <BookMarked size={14} />}
        <span>Leyenda</span>
      </button>
      {open && (
        <div className="legend-body">
          <div className="legend-section">
            <span className="legend-kicker">Formas · tipo</span>
            <ul>
              {Object.entries(TYPES).map(([k, v]) => (
                <li key={k}>
                  <span className={clsx('legend-shape', TYPE_SHAPES[k])} />
                  {v.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="legend-section">
            <span className="legend-kicker">Color · era</span>
            <ul>
              {Object.entries(ERAS).map(([k, v]) => (
                <li key={k}>
                  <span className="legend-dot" style={{ '--c': v.color }} />
                  {v.label}
                  <span className="legend-year">{v.year}</span>
                </li>
              ))}
            </ul>
            <p className="legend-note">En el presente, cada nodo toma el color de su región.</p>
          </div>
          <div className="legend-section">
            <span className="legend-kicker">Líneas · relación</span>
            <ul>
              {LINE_KINDS.map(({ kind, label }) => (
                <li key={kind}>
                  <span className={clsx('legend-line', `kind-${kind}`)} />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
