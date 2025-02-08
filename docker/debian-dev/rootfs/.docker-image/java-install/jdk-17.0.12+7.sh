#!/bin/sh -xe

jdk_version_feature=17
jdk_version_update=${jdk_version_feature}.0.12
jdk_version_patch=7
jdk_version_dir=${jdk_version_update}+${jdk_version_patch}
jdk_version_file=${jdk_version_update}_${jdk_version_patch}
java_home=/opt/jdk

curl -k -L \
    "https://github.com/adoptium/temurin${jdk_version_feature}-binaries/releases/download/jdk-${jdk_version_dir}/OpenJDK${jdk_version_feature}U-jdk_x64_linux_hotspot_${jdk_version_file}.tar.gz" \
    -o /.docker-image/jdk.tar.gz

mkdir -p ${java_home}
tar -zxf /.docker-image/jdk.tar.gz -C /.docker-image
mv -T /.docker-image/jdk-${jdk_version_dir} ${java_home}
rm /.docker-image/jdk.tar.gz

# Add executables to env path
printf '\nexport PATH=${PATH}:%s\n' "${java_home}/bin" >> /etc/profile.d/zzz-custom.sh
. /etc/profile.d/zzz-custom.sh

# Install custom certificates
/bin/sh -xe /.docker-image/java-install/keytool-import-11.sh

java -version
javac -version
