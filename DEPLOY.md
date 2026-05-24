# AOP-Wiki RDF Explorer — Deployment Guide

Deployment of the Snorql UI to the VHP4Safety Docker Swarm cluster at `https://aopwiki-rdf.vhp4safety.nl`.

The image is published to GHCR by the [`Docker Build`](.github/workflows/docker.yml) workflow on every push to `master` and on `v*` tags. The cluster pulls it from there — there is no local build step on the deploy host.

## Prerequisites

1. **DNS A record** in the Strato control panel:
   - `aopwiki-rdf.vhp4safety.nl` → `81.169.246.233` (tgx1)
   - Verify propagation: `dig +short aopwiki-rdf.vhp4safety.nl`

2. **SSH access to tgx1** as a user in the `docker` group (e.g. `mmartens`). The `tgx1` alias is pre-configured in `~/.ssh/config` for cluster developers.

3. **Traefik is running** on the Swarm with the `core` overlay network and the `letsencrypt` cert resolver — true on this cluster by default.

4. **GHCR image is public**. After the first CI publish, visit `https://github.com/marvinm2?tab=packages`, select `aop-wiki-snorql-ui`, and set visibility to **Public**. Without this, `docker pull` from the Swarm fails with `unauthorized`.

## First-time deploy

```bash
ssh tgx1
mkdir -p ~/aopwiki-snorql && cd ~/aopwiki-snorql

# Pull stack.yml (the only file the deploy host needs)
curl -fsSL \
  https://raw.githubusercontent.com/marvinm2/AOP-Wiki-Snorql-UI/master/stack.yml \
  -o stack.yml

# Defaults in stack.yml point at the live AOP-Wiki endpoint and AOP-Wiki-Queries
# examples repo. An optional .env in this directory lets you override any of:
#   SNORQL_ENDPOINT, SNORQL_EXAMPLES_REPO, SNORQL_TITLE,
#   WELCOME_TITLE, WELCOME_MESSAGE, DEFAULT_GRAPH
# touch .env  # only if you need overrides

docker stack deploy -c stack.yml aopwiki-snorql
```

Traefik picks up the labels automatically and provisions a Let's Encrypt cert via HTTP-01 challenge once DNS resolves to tgx1. The URL is live within about a minute.

## Updating to a new release

When a new image is published to GHCR (every push to `master`):

```bash
ssh tgx1
cd ~/aopwiki-snorql
docker service update --force --image ghcr.io/marvinm2/aop-wiki-snorql-ui:latest aopwiki-snorql_snorql
```

For a specific tag (e.g. a release):

```bash
docker service update --image ghcr.io/marvinm2/aop-wiki-snorql-ui:v1.2.0 aopwiki-snorql_snorql
```

`update_config: order: start-first` in `stack.yml` means a new task is started and verified healthy before the old one is removed — zero-downtime by default.

## Verify

```bash
ssh tgx1 "docker service ls --filter name=aopwiki-snorql"
# Expect: aopwiki-snorql_snorql   replicated   1/1   ghcr.io/marvinm2/aop-wiki-snorql-ui:latest

ssh tgx1 "docker service ps aopwiki-snorql_snorql"
# CURRENT STATE should be 'Running' with no errors

ssh tgx1 "docker service logs --tail 30 aopwiki-snorql_snorql"

curl -sI https://aopwiki-rdf.vhp4safety.nl
# Expect: HTTP/2 200, server: nginx (Traefik), valid Let's Encrypt cert
```

Then browse to `https://aopwiki-rdf.vhp4safety.nl` and confirm the welcome panel + examples tree render.

## Troubleshooting

**Service stuck in `0/1`:**
```bash
ssh tgx1 "docker service ps aopwiki-snorql_snorql --no-trunc"
```
Check the `ERROR` column. Common causes: GHCR auth failure (image not public yet), Traefik label conflict (router name collision with another service).

**`unauthorized` pulling from GHCR:**
Make the package public via the GitHub UI (Packages → `aop-wiki-snorql-ui` → Package settings → Change visibility).

**Browser shows `aopwiki.rdf.bigcat-bioinformatics.org` data but you expected something else:**
The default `SNORQL_ENDPOINT` is the live AOP-Wiki endpoint. To point at a different endpoint (e.g. the multi-version one), set `SNORQL_ENDPOINT` in `.env` next to `stack.yml` and re-deploy.

**TLS certificate not issued:**
Wait 1–2 minutes after the service comes up — Let's Encrypt's HTTP-01 challenge can take a moment. Then check Traefik logs: `ssh tgx1 "docker service logs traefik_traefik 2>&1 | grep -i aopwiki-snorql"`. If you see ACME errors, verify DNS actually points to `81.169.246.233`.

**Welcome panel shows the WikiPathways default text:**
The `WELCOME_MESSAGE` env var didn't get injected — check `docker service inspect aopwiki-snorql_snorql --format '{{.Spec.TaskTemplate.ContainerSpec.Env}}'` and confirm it's set.

## Rolling back

```bash
docker service rollback aopwiki-snorql_snorql
```

Swarm tracks the previous image automatically. If you need to revert to a specific older tag, use the `update --image` form above with the SHA-pinned tag from the GHCR package page.
