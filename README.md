# Atlas de Teyvat

Atlas interactivo de la historia y los misterios de Genshin Impact, inspirado en la web
interactiva de la serie *Dark*. Un mapa narrativo/cosmológico con más de 80 nodos y ~150
conexiones: Celestia, Khaenri'ah, el Abismo, los Arcontes y sus dioses caídos, las Gnosis,
las civilizaciones perdidas, los Fatui y sus Harbingers, y el viaje del Viajero.

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:5178
npm run build    # build de producción en dist/
```

## Qué incluye

- **Diagrama interactivo** (React Flow) con zoom/pan, zonas por era, nodos con forma según
  tipo (evento, personaje, facción, objeto, misterio) y color según región/era.
- **5 rutas de lectura guiadas** con pasos numerados: Entenderlo rápido, El misterio central,
  Arcontes y Gnosis, Dioses caídos y olvidados, y Cronología completa (navegables con ← →).
- **Guía por actos**: la Cuesta del Arconte completa, capítulo a capítulo — Prólogo,
  Liyue, Inazuma, Sumeru, Fontaine, Natlan y el Nod-Krai actual (marcado como arco abierto,
  sin inventar lo que el juego todavía no ha contado).
- **Panel de detalle** por nodo: resumen, explicación, "por qué importa", conexiones
  clicables, tags, distinción entre canon confirmado/interpretación/tema abierto, y el
  periodo aproximado en el que ocurre (Teyvat rara vez da fechas absolutas, así que se
  usan distancias relativas: "hace 500 años", "hace ~2.000 años"...).
- **Buscador**, **filtros** por era/región/tipo y **leyenda visual** (con esos mismos años).
- **Modo sin spoilers**: selector de progreso que oculta los nodos con spoilers de regiones
  que aún no has jugado — también se aplica a la guía por actos.

## Estructura

- `src/data/lore.js` — base de datos de lore: nodos, conexiones, rutas, actos, eras y regiones.
- `src/components/Graph.jsx` — diagrama (React Flow) y estados visuales.
- `src/components/LoreNode.jsx` — nodos personalizados y zonas de era.
- `src/components/FloatingEdge.jsx` — aristas flotantes centro-a-centro con etiquetas.
- `src/components/DetailPanel.jsx` — panel lateral de detalle.
- `src/components/Toolbar.jsx` — búsqueda, rutas, filtros y control de spoilers.
- `src/components/RouteGuide.jsx` — guía paso a paso del modo ruta.
- `src/components/ActsGuide.jsx` — guía por actos de la Cuesta del Arconte.
- `src/components/Intro.jsx` — portada.

Proyecto de fans, sin afiliación con HoYoverse. No usa assets oficiales: toda la parte
visual es SVG/CSS propio. Los eventos aún no contados en el juego se marcan como
"tema abierto" en lugar de inventarse.
