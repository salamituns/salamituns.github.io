# salamituns.github.io

Analytical portfolio. One person, one method, applied across domains.

Live at [salamituns.github.io](https://salamituns.github.io).

## Projects

- **[`/hipaa/`](https://salamituns.github.io/hipaa/)** — HIPAA breach + home health agency exposure. Three interactive deck.gl maps mapping 7,486 breaches against 12,306 Medicare-certified agencies. Federal data only.

- **[`/ghgrp/`](https://salamituns.github.io/ghgrp/)** — Who owns America's industrial emissions. Fourteen years of EPA Greenhouse Gas Reporting Program data, reconciled at the parent-company level. 8,106 facilities, 3,327 parents, a consolidation pattern that follows the Gulf Coast pipeline grid.

- **[`/darkdata/`](https://salamituns.github.io/darkdata/)** — Where US oil data actually lives. Six US oil-and-gas basins walked one at a time. 1.92 million wells mapped, 89.1 percent dark measured across five basins, one architectural wall (Texas RRC). Each basin ships a 16-step scrollytelling story plus the raw data.
  - **[`/darkdata/basins.html`](https://salamituns.github.io/darkdata/basins.html)** — Cross-basin field guide. Interactive deck.gl + maplibre map, five view modes, click any basin to inspect.

Each new domain gets its own folder. Landing page (`index.html`) links to all projects.

## Stack

Static HTML. No build step. GitHub Pages serves from `main` branch root. `.nojekyll` disables Jekyll transforms so files render as authored.

Visualization: deck.gl (GPU-accelerated WebGL layers) over maplibre-gl basemaps. Static figures: matplotlib + geopandas. Data: open federal and state regulator endpoints; no paywalled feeds.

Type: Fraunces (display serif) + Inter (UI sans). Editorial palette: paper #F6F3EB, ink #0E0E0E, accent #A23B2A. Shared tokens in `/assets/site.css`.

## Companion repos

- **[`darkdata-repo`](https://github.com/salamituns/darkdata-repo)** — Pipeline and figure code for the Where US Oil Data Lives series. Six basin pipelines + the cross-basin primer.

## Author

[Olatunde Salami](https://linkedin.com/in/salamituns). Geoscientist turned software engineer. If you work any side of these analyses (operator, regulator, underwriter, policy team), or want to fund the next domain, LinkedIn is the fastest way to reach me.
