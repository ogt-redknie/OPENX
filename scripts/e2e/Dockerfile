# syntax=docker/dockerfile:1.7
#
# Shared Docker E2E image.
# `bare` is a clean Node/Git runner for install/update lanes. `functional`
# installs the prepared OPNEX npm tarball into /app for built-app lanes.

FROM node:24-bookworm-slim@sha256:e8e2e91b1378f83c5b2dd15f0247f34110e2fe895f6ca7719dbb780f929368eb AS e2e-runner

# python3 covers package/plugin install paths that execute helper scripts while
# staying below a full build-essential toolchain.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates git python3 \
 && rm -rf /var/lib/apt/lists/*

RUN corepack enable
RUN npm install -g tsx@4.21.0 --no-fund --no-audit

RUN useradd --create-home --shell /bin/bash appuser \
 && mkdir -p /app \
 && chown appuser:appuser /app

ENV HOME="/home/appuser"
ENV PATH="/home/appuser/.local/bin:${PATH}"
ENV NODE_OPTIONS="--disable-warning=ExperimentalWarning"
# Docker E2E lanes start many loopback gateways concurrently; mDNS advertising
# is unrelated to those checks and can flap under container CPU/network load.
ENV OPNEX_DISABLE_BONJOUR="1"

USER appuser
WORKDIR /app

FROM e2e-runner AS bare

CMD ["bash"]

FROM bare AS build

CMD ["bash"]

FROM bare AS functional

# The app under test enters through the named BuildKit context, not by copying
# checkout sources into the image.
COPY --from=opnex_package --chown=appuser:appuser opnex-current.tgz /tmp/opnex-current.tgz
# Preserve package self-reference imports such as opnex/plugin-sdk/* after
# copying the installed package out of npm's global node_modules tree.
RUN npm install -g --prefix /tmp/opnex-prefix /tmp/opnex-current.tgz --no-fund --no-audit \
 && cp -a /tmp/opnex-prefix/lib/node_modules/opnex/. /app/ \
 && mkdir -p "$HOME/.local/bin" \
 && ln -sf /app/opnex.mjs "$HOME/.local/bin/opnex" \
 && mkdir -p /app/node_modules \
 && ln -sf /app /app/node_modules/opnex \
 && rm -rf /tmp/opnex-prefix /tmp/opnex-current.tgz

CMD ["bash"]
