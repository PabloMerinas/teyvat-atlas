import { getBezierPath, useInternalNode, EdgeLabelRenderer } from '@xyflow/react';
import clsx from 'clsx';

// Punto de intersección entre el borde del nodo y la línea hacia el otro nodo.
function getNodeIntersection(node, otherNode) {
  const w = (node.measured?.width ?? 90) / 2;
  const h = (node.measured?.height ?? 90) / 2;
  const x2 = node.internals.positionAbsolute.x + w;
  const y2 = node.internals.positionAbsolute.y + h;
  const x1 = otherNode.internals.positionAbsolute.x + (otherNode.measured?.width ?? 90) / 2;
  const y1 = otherNode.internals.positionAbsolute.y + (otherNode.measured?.height ?? 90) / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  return { x: w * (xx3 + yy3) + x2, y: h * (-xx3 + yy3) + y2 };
}

export default function FloatingEdge({ id, source, target, data, markerEnd }) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  if (!sourceNode || !targetNode) return null;

  const s = getNodeIntersection(sourceNode, targetNode);
  const t = getNodeIntersection(targetNode, sourceNode);

  const [path, labelX, labelY] = getBezierPath({
    sourceX: s.x,
    sourceY: s.y,
    targetX: t.x,
    targetY: t.y,
    curvature: 0.28,
  });

  const { kind = 'vinculo', state, label } = data || {};
  const highlighted = state === 'lit';

  return (
    <g className={clsx('lore-edge', `kind-${kind}`, { 'is-lit': highlighted, 'is-faded': state === 'faded' })}>
      <path className="lore-edge-hit" d={path} fill="none" />
      <path id={id} className="lore-edge-path" d={path} fill="none" markerEnd={markerEnd} />
      {label && highlighted && (
        <EdgeLabelRenderer>
          <div
            className="edge-label"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </g>
  );
}
