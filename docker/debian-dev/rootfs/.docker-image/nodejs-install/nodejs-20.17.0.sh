#!/bin/sh -xe

nodejs_version=20.17.0
nodejs_home=/opt/nodejs

curl -k -L \
    "https://nodejs.org/download/release/v${nodejs_version}/node-v${nodejs_version}-linux-x64.tar.gz" \
    -o /.docker-image/nodejs.tar.gz

mkdir -p ${nodejs_home}
tar -zxf /.docker-image/nodejs.tar.gz -C /.docker-image
mv -T /.docker-image/node-v${nodejs_version}-linux-x64 ${nodejs_home}
rm /.docker-image/nodejs.tar.gz

# Add executables to env path
printf '\nexport PATH=${PATH}:%s\n' "${nodejs_home}/bin" >> /etc/profile.d/zzz-custom.sh
. /etc/profile.d/zzz-custom.sh

node --version
npm --version
