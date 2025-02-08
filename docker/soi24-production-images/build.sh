#!/bin/sh -xe

docker image rm \
    localhost/soi24/web-server:1 \
    localhost/soi24/ui:1 \
    || true

docker system prune -f

(
    cd web-server
    docker build \
        --build-context src=../../../soi24-game-web-server \
        -t localhost/soi24/web-server:1 .
)

(
    cd ui
    docker build \
        --build-context src=../../../soi24-game-ui \
        -t localhost/soi24/ui:1 .
)
