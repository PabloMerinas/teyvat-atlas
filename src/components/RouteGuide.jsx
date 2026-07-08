import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { NODE_MAP } from '../data/lore.js';

export default function RouteGuide({ route, stepIndex, onStep, onExit }) {
  if (!route) return null;
  const step = route.steps[stepIndex];
  const node = NODE_MAP[step.node];

  return (
    <div className="route-guide" style={{ '--c': route.color }}>
      <div className="guide-head">
        <span className="guide-route">{route.title}</span>
        <span className="guide-count">
          {stepIndex + 1} / {route.steps.length}
        </span>
        <button className="guide-exit" onClick={onExit} aria-label="Salir de la ruta">
          <X size={14} />
        </button>
      </div>
      <div className="guide-body">
        <button
          className="guide-arrow"
          disabled={stepIndex === 0}
          onClick={() => onStep(stepIndex - 1)}
          aria-label="Paso anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="guide-step">
          <span className="guide-node">{node.title}</span>
          <p className="guide-note">{step.note}</p>
        </div>
        <button
          className="guide-arrow"
          disabled={stepIndex === route.steps.length - 1}
          onClick={() => onStep(stepIndex + 1)}
          aria-label="Paso siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="guide-progress">
        {route.steps.map((s, i) => (
          <button
            key={s.node}
            className={i === stepIndex ? 'dot on' : i < stepIndex ? 'dot done' : 'dot'}
            onClick={() => onStep(i)}
            aria-label={`Paso ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
