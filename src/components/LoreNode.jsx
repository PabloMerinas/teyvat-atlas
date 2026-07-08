import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import clsx from 'clsx';
import { LoreIcon } from './icons.jsx';

// Nodo del atlas: la forma depende del tipo, el color de la región/era.
const LoreNode = memo(function LoreNode({ data, selected }) {
  const { node, color, state, routeStep, locked } = data;
  const size = node.size || 'md';

  return (
    <div
      className={clsx('lore-node', `type-${node.type}`, `size-${size}`, {
        'is-selected': selected,
        'is-neighbor': state === 'neighbor',
        'is-faded': state === 'faded',
        'is-route': routeStep != null,
        'is-locked': locked,
      })}
      style={{ '--c': color }}
    >
      <Handle type="target" position={Position.Top} className="lore-handle" />
      <Handle type="source" position={Position.Bottom} className="lore-handle" />
      {routeStep != null && <span className="route-badge">{routeStep + 1}</span>}
      <div className="node-shape">
        <div className="node-shape-inner">
          <LoreIcon name={locked ? 'HelpCircle' : node.icon} size={size === 'lg' ? 26 : size === 'sm' ? 16 : 20} />
        </div>
      </div>
      <span className="node-label">{locked ? '· · ·' : node.title}</span>
    </div>
  );
});

// Etiqueta de zona/era: solo decorativa.
export const ZoneNode = memo(function ZoneNode({ data }) {
  return (
    <div className="zone" style={{ '--c': data.color, width: data.w, height: data.h }}>
      <span className="zone-title">{data.title}</span>
    </div>
  );
});

export default LoreNode;
