#!/bin/sh -xe

enable_build=0

while [ $# -gt 0 ] ; do
    arg=$1
    shift
    case "$arg" in
        -b) enable_build=1 ;;
        *) echo "WARN unknown option: $arg" ;;
    esac
done

if [ "${enable_build}" = "1" ] ; then
    (
        cd ../soi24-production-images
        ./build.sh
    )
fi

trap ' \
    docker compose down -v
    trap - EXIT
    exit
' EXIT INT HUP

docker compose up -d \
    && docker compose logs -f
