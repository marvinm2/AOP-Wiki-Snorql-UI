[![Docker Build](https://github.com/marvinm2/AOP-Wiki-Snorql-UI/actions/workflows/docker.yml/badge.svg)](https://github.com/marvinm2/AOP-Wiki-Snorql-UI/actions/workflows/docker.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# AOP-Wiki RDF Explorer

SPARQL query interface for the AOP-Wiki RDF endpoint, live at
<https://aopwiki.rdf.bigcat-bioinformatics.org/> (alias <https://aopwiki-rdf.vhp4safety.nl>).

This repository holds only the **AOP-Wiki instance** of the Snorql UI. The UI itself (the
"engine") lives in [`wikipathways/Snorql-UI`](https://github.com/wikipathways/Snorql-UI) and is
published as `ghcr.io/wikipathways/snorql-ui`. The image built here is that engine plus:

| File | What it sets |
|---|---|
| [`config.js`](config.js) | endpoint, examples ([AOP-Wiki-Queries](https://github.com/marvinm2/AOP-Wiki-Queries): the index it publishes on its `examples-index` branch, `examplesFormat: "index"`), namespaces, autocomplete types (AOP, key event, stressor, chemical, taxon), navbar linkouts, logo, favicon, footer |
| [`theme.css`](theme.css) | Maastricht University colours, full-width navbar |
| [`images/`](images) | logo, favicon, TGX logo |
| [`stack.yml`](stack.yml) | Docker Swarm stack: this UI, the AOP-Wiki API and the Virtuoso endpoint |

## Example queries

The examples are `.ttl` files in [AOP-Wiki-Queries](https://github.com/marvinm2/AOP-Wiki-Queries),
each with a permanent identifier (`AOPQ012`) and a version; see its `AUTHORING.md`. The editor
loads the index that repository publishes, so a merged change shows up within minutes, with no
rebuild here. Links: `?example=AOPQ012`, `&version=1.0.0`, and old `?example=<path>.rq` links
still open the right example. The permanent IRIs
`https://aopwiki.rdf.bigcat-bioinformatics.org/.well-known/sparql-examples/AOPQ012` redirect to
the editor (a Traefik route on the cluster, see the cluster doc `services/aopwiki-snorql.md`).

## Changing things

- **Instance settings or look:** edit the files above. `node test/check-config.js` checks
  `config.js`; CI runs it before building.
- **UI features or bugs:** change the engine upstream in `wikipathways/Snorql-UI`, then bump the
  `FROM` tag in [`Dockerfile`](Dockerfile). Dependabot opens that PR when a new engine version
  is published.
- At container start the engine's `script.sh` applies environment variables over `config.js`
  (`SNORQL_ENDPOINT`, `SNORQL_TITLE`, `WELCOME_MESSAGE`, ...; see the engine's `FORK.md`).
  The browser tab title comes from `SNORQL_TITLE`.

## Try it locally

```bash
docker build -t aop-wiki-snorql-ui .
docker run --rm -p 8088:80 -e SNORQL_TITLE="AOP-Wiki RDF Explorer" aop-wiki-snorql-ui
# open http://localhost:8088
```

Deployment, updates and rollback: [`DEPLOY.md`](DEPLOY.md). Questions and bugs:
[GitHub Issues](https://github.com/marvinm2/AOP-Wiki-Snorql-UI/issues).
