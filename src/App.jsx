import { useCallback, useEffect, useState } from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';

import Graph from './components/Graph.jsx';
import Toolbar from './components/Toolbar.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import RouteGuide from './components/RouteGuide.jsx';
import Legend from './components/Legend.jsx';
import Intro from './components/Intro.jsx';
import ActsGuide from './components/ActsGuide.jsx';
import { NODE_MAP } from './data/lore.js';
import './App.css';

function Atlas() {
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState({ eras: new Set(), regions: new Set(), types: new Set() });
  const [activeRoute, setActiveRoute] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [spoilerLimit, setSpoilerLimit] = useState('todo');
  const [introState, setIntroState] = useState('open'); // open | closing | closed
  const [showActs, setShowActs] = useState(false);

  const { setCenter } = useReactFlow();

  const focusNode = useCallback(
    (nodeId, { select = true, zoom = 1.1 } = {}) => {
      const node = NODE_MAP[nodeId];
      if (!node) return;
      setCenter(node.pos[0] + 50, node.pos[1] + 50, { zoom, duration: 700 });
      if (select) setSelectedId(nodeId);
    },
    [setCenter],
  );

  const dismissIntro = useCallback(() => {
    setIntroState('closing');
    setTimeout(() => setIntroState('closed'), 650);
  }, []);

  const pickRoute = useCallback(
    (route) => {
      setActiveRoute(route);
      setStepIndex(0);
      if (route) {
        focusNode(route.steps[0].node);
      } else {
        setSelectedId(null);
      }
    },
    [focusNode],
  );

  const startRouteFromIntro = useCallback(
    (route) => {
      dismissIntro();
      setTimeout(() => pickRoute(route), 350);
    },
    [dismissIntro, pickRoute],
  );

  const goToStep = useCallback(
    (i) => {
      if (!activeRoute) return;
      const clamped = Math.max(0, Math.min(activeRoute.steps.length - 1, i));
      setStepIndex(clamped);
      focusNode(activeRoute.steps[clamped].node);
    },
    [activeRoute, focusNode],
  );

  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.key === 'Escape') {
        if (showActs) setShowActs(false);
        else if (activeRoute) pickRoute(null);
        else setSelectedId(null);
      }
      if (activeRoute) {
        if (e.key === 'ArrowRight') goToStep(stepIndex + 1);
        if (e.key === 'ArrowLeft') goToStep(stepIndex - 1);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeRoute, stepIndex, goToStep, pickRoute, showActs]);

  return (
    <div className={`atlas-app${selectedId ? ' has-panel' : ''}${activeRoute ? ' has-route' : ''}`}>
      <div className="atlas-canvas">
        <Graph
          selectedId={selectedId}
          onSelect={setSelectedId}
          filters={filters}
          activeRoute={activeRoute}
          spoilerLimit={spoilerLimit}
        />
      </div>

      <Toolbar
        onFocusNode={focusNode}
        filters={filters}
        setFilters={setFilters}
        activeRoute={activeRoute}
        onPickRoute={pickRoute}
        spoilerLimit={spoilerLimit}
        setSpoilerLimit={setSpoilerLimit}
        onOpenActs={() => setShowActs(true)}
      />

      <DetailPanel
        nodeId={selectedId}
        onSelect={focusNode}
        onClose={() => setSelectedId(null)}
        spoilerLimit={spoilerLimit}
      />

      <RouteGuide route={activeRoute} stepIndex={stepIndex} onStep={goToStep} onExit={() => pickRoute(null)} />

      <Legend />

      {introState !== 'closed' && (
        <Intro onExplore={dismissIntro} onPickRoute={startRouteFromIntro} closing={introState === 'closing'} />
      )}

      {showActs && <ActsGuide onClose={() => setShowActs(false)} spoilerLimit={spoilerLimit} />}
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Atlas />
    </ReactFlowProvider>
  );
}
