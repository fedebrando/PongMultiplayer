#!/bin/sh -xe

# Install system packages

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y \
    ca-certificates \
    procps \
    curl \
    git

update-ca-certificates

# Setup custom scripts

chmod a+x /etc/profile.d/zzz-custom.sh
printf "\n. /etc/profile.d/zzz-custom.sh\n" >> /etc/bash.bashrc

chmod -R a+x /usr/local/bin
