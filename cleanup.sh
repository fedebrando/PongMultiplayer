#!/bin/sh

(
    cd docker/soi24-devcontainer
    docker compose down -v
)

(
    cd docker/soi24-production
    docker compose down -v
)

docker image rm localhost/soi24/debian-dev:1
docker image rm localhost/soi24/web-server:1
docker image rm localhost/soi24/ui:1

docker system prune -f
