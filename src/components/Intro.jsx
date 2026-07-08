import { Compass } from 'lucide-react';
import { LoreIcon } from './icons.jsx';
import { ROUTES, NODES, EDGES, ACTS } from '../data/lore.js';

const totalActs = ACTS.reduce((sum, chapter) => sum + chapter.acts.length, 0);

export default function Intro({ onExplore, onPickRoute, closing }) {
  return (
    <div className={closing ? 'intro closing' : 'intro'}>
      <div className="intro-stars" aria-hidden="true" />
      <div className="intro-content">
        <p className="intro-kicker">Un mapa para los perdidos entre mundos</p>
        <h1 className="intro-title">
          Atlas <span className="intro-de">de</span> Teyvat
        </h1>
        <div className="intro-divider" aria-hidden="true">
          <span /> ✦ <span />
        </div>
        <p className="intro-lede">
          Celestia calla, Khaenri&apos;ah arde en la memoria y tu gemelo camina con el Abismo.
          Este atlas conecta los hilos: qué pasó, quién mueve las piezas y por qué importa.
        </p>

        <div className="intro-routes">
          {ROUTES.map((r) => (
            <button key={r.id} className="intro-route" style={{ '--c': r.color }} onClick={() => onPickRoute(r)}>
              <span className="intro-route-glyph">
                <LoreIcon name={r.icon} size={18} />
              </span>
              <span className="intro-route-title">{r.title}</span>
              <span className="intro-route-tag">{r.tagline}</span>
            </button>
          ))}
        </div>

        <button className="intro-explore" onClick={onExplore}>
          <Compass size={16} />
          Explorar libremente
        </button>
        <p className="intro-stats">
          {NODES.length} nodos · {EDGES.length} conexiones · {totalActs} actos de la Cuesta del Arconte
        </p>
        <p className="intro-foot">
          Proyecto de fans, sin afiliación con HoYoverse · Lo confirmado se distingue de lo abierto
        </p>
      </div>
    </div>
  );
}
