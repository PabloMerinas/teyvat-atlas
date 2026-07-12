import { useMemo, useRef, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Route, EyeOff, X, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { LoreIcon } from './icons.jsx';
import {
  NODES,
  ERAS,
  REGIONS,
  TYPES,
  ROUTES,
  SPOILER_ORDER,
  SPOILER_LABELS,
  nodeColor,
  spoilerIndex,
} from '../data/lore.js';

function normalize(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export default function Toolbar({
  onFocusNode,
  filters,
  setFilters,
  activeRoute,
  onPickRoute,
  spoilerLimit,
  setSpoilerLimit,
  onOpenActs,
}) {
  const [query, setQuery] = useState('');
  const [openMenu, setOpenMenu] = useState(null); // 'filters' | 'routes' | null
  const rootRef = useRef(null);

  useEffect(() => {
    function onDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpenMenu(null);
    }
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    const limit = spoilerIndex(spoilerLimit);
    return NODES.filter((n) => spoilerIndex(n.spoiler) <= limit)
      .filter(
        (n) =>
          normalize(n.title).includes(q) ||
          normalize(n.summary).includes(q) ||
          n.tags.some((t) => normalize(t).includes(q)),
      )
      .slice(0, 7);
  }, [query, spoilerLimit]);

  const toggleFilter = (group, key) => {
    setFilters((prev) => {
      const next = new Set(prev[group]);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...prev, [group]: next };
    });
  };

  const filterCount = filters.eras.size + filters.regions.size + filters.types.size;

  return (
    <div className="toolbar" ref={rootRef}>
      <div className="toolbar-bar">
        <div className="brand">
          <span className="brand-star">✦</span>
          <span className="brand-name">Atlas de Teyvat</span>
        </div>

        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar personaje, evento, misterio…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpenMenu(null)}
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')} aria-label="Limpiar búsqueda">
              <X size={13} />
            </button>
          )}
          {results.length > 0 && (
            <ul className="search-results">
              {results.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => {
                      onFocusNode(n.id);
                      setQuery('');
                    }}
                    style={{ '--c': nodeColor(n) }}
                  >
                    <span className="result-glyph">
                      <LoreIcon name={n.icon} size={15} />
                    </span>
                    <span>
                      <span className="result-title">{n.title}</span>
                      <span className="result-sub">{n.summary}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="toolbar-actions">
          <button className="tool-btn" onClick={onOpenActs}>
            <BookOpen size={15} />
            <span className="btn-label">Actos</span>
          </button>
          <button
            className={clsx('tool-btn', { active: openMenu === 'routes' || activeRoute })}
            onClick={() => setOpenMenu(openMenu === 'routes' ? null : 'routes')}
          >
            <Route size={15} />
            <span className="btn-label">{activeRoute ? activeRoute.title : 'Rutas'}</span>
          </button>
          <button
            className={clsx('tool-btn', { active: openMenu === 'filters' || filterCount > 0 })}
            onClick={() => setOpenMenu(openMenu === 'filters' ? null : 'filters')}
          >
            <SlidersHorizontal size={15} />
            <span className="btn-label">Filtros{filterCount > 0 ? ` · ${filterCount}` : ''}</span>
          </button>
          <div className="spoiler-select">
            <EyeOff size={14} />
            <select
              value={spoilerLimit}
              onChange={(e) => setSpoilerLimit(e.target.value)}
              aria-label="Nivel de spoilers"
            >
              {SPOILER_ORDER.map((k) => (
                <option key={k} value={k}>
                  {SPOILER_LABELS[k]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {openMenu === 'routes' && (
        <div className="dropdown routes-dropdown">
          <p className="dropdown-hint">Elige una ruta de lectura: el atlas iluminará solo lo esencial, paso a paso.</p>
          <div className="route-cards">
            {ROUTES.map((r) => (
              <button
                key={r.id}
                className={clsx('route-card', { active: activeRoute?.id === r.id })}
                style={{ '--c': r.color }}
                onClick={() => {
                  onPickRoute(activeRoute?.id === r.id ? null : r);
                  setOpenMenu(null);
                }}
              >
                <span className="route-card-glyph">
                  <LoreIcon name={r.icon} size={17} />
                </span>
                <span className="route-card-title">{r.title}</span>
                <span className="route-card-tag">{r.tagline}</span>
                <span className="route-card-steps">{r.steps.length} pasos</span>
              </button>
            ))}
          </div>
          {activeRoute && (
            <button className="route-exit" onClick={() => { onPickRoute(null); setOpenMenu(null); }}>
              Salir del modo ruta
            </button>
          )}
        </div>
      )}

      {openMenu === 'filters' && (
        <div className="dropdown filters-dropdown">
          <div className="filter-group">
            <span className="filter-label">Era</span>
            <div className="chip-row">
              {Object.entries(ERAS).map(([k, v]) => (
                <button
                  key={k}
                  className={clsx('filter-chip', { on: filters.eras.has(k) })}
                  style={{ '--chip': v.color }}
                  onClick={() => toggleFilter('eras', k)}
                >
                  {v.short}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">Región</span>
            <div className="chip-row">
              {Object.entries(REGIONS).map(([k, v]) => (
                <button
                  key={k}
                  className={clsx('filter-chip', { on: filters.regions.has(k) })}
                  style={{ '--chip': v.color }}
                  onClick={() => toggleFilter('regions', k)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">Tipo</span>
            <div className="chip-row">
              {Object.entries(TYPES).map(([k, v]) => (
                <button
                  key={k}
                  className={clsx('filter-chip', { on: filters.types.has(k) })}
                  style={{ '--chip': '#cbc3ae' }}
                  onClick={() => toggleFilter('types', k)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          {filterCount > 0 && (
            <button
              className="route-exit"
              onClick={() => setFilters({ eras: new Set(), regions: new Set(), types: new Set() })}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
