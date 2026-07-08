import { X, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import clsx from 'clsx';
import { LoreIcon } from './icons.jsx';
import {
  NODE_MAP,
  ERAS,
  REGIONS,
  TYPES,
  CANON,
  nodeColor,
  connectionsOf,
  spoilerIndex,
} from '../data/lore.js';

const KIND_LABEL = {
  origen: 'origen',
  causa: 'causa',
  vinculo: 'vínculo',
  conflicto: 'conflicto',
  misterio: 'misterio',
};

export default function DetailPanel({ nodeId, onSelect, onClose, spoilerLimit }) {
  const node = nodeId ? NODE_MAP[nodeId] : null;
  if (!node) return null;

  const color = nodeColor(node);
  const locked = spoilerIndex(node.spoiler) > spoilerIndex(spoilerLimit);
  const canon = CANON[node.canon];
  const connections = connectionsOf(node.id);

  return (
    <aside className="detail-panel" style={{ '--c': color }}>
      <button className="panel-close" onClick={onClose} aria-label="Cerrar panel">
        <X size={16} />
      </button>

      {locked ? (
        <div className="panel-locked">
          <Lock size={28} />
          <h2>Contenido oculto</h2>
          <p>
            Este nodo contiene spoilers de <strong>{REGIONS[node.spoiler]?.label ?? node.spoiler}</strong> en
            adelante. Sube tu progreso en el selector de la barra superior para revelarlo.
          </p>
        </div>
      ) : (
        <>
          <header className="panel-header">
            <div className="panel-glyph">
              <LoreIcon name={node.icon} size={24} />
            </div>
            <div>
              <span className="panel-kicker">
                {TYPES[node.type].label} · {ERAS[node.era].short}
              </span>
              <h2 className="panel-title">{node.title}</h2>
            </div>
          </header>

          <div className="panel-chips">
            {node.region && (
              <span className="chip chip-region" style={{ '--chip': REGIONS[node.region].color }}>
                {REGIONS[node.region].label}
              </span>
            )}
            <span className="chip chip-canon" style={{ '--chip': canon.color }}>
              {canon.label}
            </span>
          </div>

          <p className="panel-summary">{node.summary}</p>
          <p className="panel-body">{node.body}</p>

          <div className="panel-why">
            <span className="why-kicker">Por qué importa</span>
            <p>{node.why}</p>
          </div>

          {connections.length > 0 && (
            <div className="panel-connections">
              <span className="section-kicker">Conexiones</span>
              <ul>
                {connections.map(({ edge, otherId, direction }) => {
                  const other = NODE_MAP[otherId];
                  const otherLocked = spoilerIndex(other.spoiler) > spoilerIndex(spoilerLimit);
                  return (
                    <li key={edge.id}>
                      <button
                        className={clsx('connection-pill', `kind-${edge.kind}`)}
                        onClick={() => onSelect(otherId)}
                      >
                        {direction === 'out' ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
                        <span className="conn-title">{otherLocked ? '· · ·' : other.title}</span>
                        <span className="conn-kind">{edge.label || KIND_LABEL[edge.kind]}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="panel-tags">
            {node.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
