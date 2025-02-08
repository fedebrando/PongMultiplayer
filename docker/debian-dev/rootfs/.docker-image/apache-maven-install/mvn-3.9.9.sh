#!/bin/sh -xe

mvn_version_major=3
mvn_version=${mvn_version_major}.9.9
mvn_home=/opt/apache-maven

curl -k -L \
    "https://dlcdn.apache.org/maven/maven-${mvn_version_major}/${mvn_version}/binaries/apache-maven-${mvn_version}-bin.tar.gz" \
    -o /.docker-image/apache-maven.tar.gz

mkdir -p ${mvn_home}
tar -zxf /.docker-image/apache-maven.tar.gz -C /.docker-image
mv -T /.docker-image/apache-maven-${mvn_version} ${mvn_home}
rm /.docker-image/apache-maven.tar.gz

# Add executables to env path
printf '\nexport PATH=${PATH}:%s\n' "${mvn_home}/bin" >> /etc/profile.d/zzz-custom.sh
. /etc/profile.d/zzz-custom.sh

mvn --version
