import { useMemo, useCallback } from 'react';
import { ReactFlow, useReactFlow, useStore } from '@xyflow/react';
import { Plus, Minus, Maximize } from 'lucide-react';
import '@xyflow/react/dist/style.css';

import LoreNode, { ZoneNode } from './LoreNode.jsx';
import FloatingEdge from './FloatingEdge.jsx';
import { NODES, EDGES, ZONES, nodeColor, spoilerIndex } from '../data/lore.js';

const nodeTypes = { lore: LoreNode, zone: ZoneNode };
const edgeTypes = { floating: FloatingEdge };

function ZoomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return (
    <div className="zoom-controls">
      <button onClick={() => zoomIn({ duration: 300 })} aria-label="Acercar"><Plus size={16} /></button>
      <button onClick={() => zoomOut({ duration: 300 })} aria-label="Alejar"><Minus size={16} /></button>
      <button onClick={() => fitView({ duration: 600, padding: 0.1 })} aria-label="Ajustar vista"><Maximize size={15} /></button>
    </div>
  );
}

export default function Graph({ selectedId, onSelect, filters, activeRoute, spoilerLimit }) {
  // Zoom semántico: de lejos solo anclas y eras; de cerca, todo el detalle.
  const zoomTier = useStore((s) => (s.transform[2] < 0.5 ? 'far' : s.transform[2] < 0.9 ? 'mid' : 'near'));
  const routeSet = useMemo(() => {
    if (!activeRoute) return null;
    return new Map(activeRoute.steps.map((s, i) => [s.node, i]));
  }, [activeRoute]);

  const neighborSet = useMemo(() => {
    if (!selectedId) return null;
    const set = new Set();
    for (const e of EDGES) {
      if (e.source === selectedId) set.add(e.target);
      if (e.target === selectedId) set.add(e.source);
    }
    return set;
  }, [selectedId]);

  const filtersActive = filters.eras.size > 0 || filters.regions.size > 0 || filters.types.size > 0;
  const limitIdx = spoilerIndex(spoilerLimit);

  const matchesFilters = useCallback(
    (n) => {
      if (filters.eras.size > 0 && !filters.eras.has(n.era)) return false;
      if (filters.regions.size > 0 && !filters.regions.has(n.region)) return false;
      if (filters.types.size > 0 && !filters.types.has(n.type)) return false;
      return true;
    },
    [filters],
  );

  const nodes = useMemo(() => {
    const zoneNodes = ZONES.map((z) => ({
      id: z.id,
      type: 'zone',
      position: { x: z.pos[0], y: z.pos[1] },
      data: { title: z.title, color: z.color, w: z.w, h: z.h },
      draggable: false,
      selectable: false,
      focusable: false,
      zIndex: -10,
    }));

    const loreNodes = NODES.map((n) => {
      const locked = spoilerIndex(n.spoiler) > limitIdx;
      let state = 'normal';
      if (routeSet) {
        state = routeSet.has(n.id) ? 'normal' : 'faded';
      } else if (filtersActive && !matchesFilters(n)) {
        state = 'faded';
      } else if (selectedId && n.id !== selectedId) {
        state = neighborSet?.has(n.id) ? 'neighbor' : 'faded';
      }
      return {
        id: n.id,
        type: 'lore',
        position: { x: n.pos[0], y: n.pos[1] },
        data: {
          node: n,
          color: nodeColor(n),
          state,
          locked,
          routeStep: routeSet?.get(n.id) ?? null,
        },
        selected: n.id === selectedId,
        draggable: false,
        connectable: false,
      };
    });

    return [...zoneNodes, ...loreNodes];
  }, [selectedId, neighborSet, routeSet, filtersActive, matchesFilters, limitIdx]);

  const edges = useMemo(
    () =>
      EDGES.map((e) => {
        let state = 'normal';
        if (routeSet) {
          state = routeSet.has(e.source) && routeSet.has(e.target) ? 'lit' : 'faded';
        } else if (selectedId) {
          state = e.source === selectedId || e.target === selectedId ? 'lit' : 'faded';
        }
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          type: 'floating',
          data: { kind: e.kind, label: e.label, state },
        };
      }),
    [selectedId, routeSet],
  );

  return (
    <div className={`graph-wrap zoom-${zoomTier}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_, node) => onSelect(node.type === 'lore' ? node.id : null)}
        onPaneClick={() => onSelect(null)}
        fitView
        fitViewOptions={{ padding: 0.08 }}
        minZoom={0.1}
        maxZoom={2.2}
        nodesConnectable={false}
        elevateNodesOnSelect={false}
        proOptions={{ hideAttribution: false }}
      >
        <ZoomControls />
      </ReactFlow>
    </div>
  );
}
